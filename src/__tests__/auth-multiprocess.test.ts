import { fork, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { readStoredCredentials, writeStoredCredentials } from '../auth/credential-store.js';

jest.setTimeout(30_000);

type Message = { event: string; token?: string; code?: number; message?: string };
let directory: string;
let children: ChildProcess[];

function start(action: string): ChildProcess {
  const child = fork(path.resolve('src/__tests__/fixtures/auth-worker.mjs'), [action], {
    execArgv: ['--loader', 'ts-node/esm'],
    env: { ...process.env, MCP_LINEAR_CONFIG_DIR: directory, TS_NODE_TRANSPILE_ONLY: 'true', NODE_NO_WARNINGS: '1' },
    stdio: ['ignore', 'ignore', 'inherit', 'ipc'],
  });
  children.push(child);
  return child;
}

async function message(child: ChildProcess): Promise<Message> {
  const [value] = await once(child, 'message');
  if (value.event === 'error') throw new Error(value.message);
  return value;
}

beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-linear-multiprocess-'));
  process.env.MCP_LINEAR_CONFIG_DIR = directory;
  children = [];
});
afterEach(async () => {
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL');
      await once(child, 'exit');
    }
  }
  delete process.env.MCP_LINEAR_CONFIG_DIR;
  fs.rmSync(directory, { recursive: true, force: true });
});

it('does not steal an old lock held by a live process and recovers after it dies', async () => {
  const holder = start('hold');
  expect((await message(holder)).event).toBe('held');
  const lock = path.join(directory, 'credentials.json.lock');
  const old = new Date(Date.now() - 120_000);
  fs.utimesSync(lock, old, old);
  const contender = start('acquire');
  expect((await message(contender)).event).toBe('started');
  const acquired = message(contender);
  let finished = false;
  void acquired.then(() => { finished = true; });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  expect(finished).toBe(false);
  const exited = once(holder, 'exit');
  holder.kill('SIGKILL');
  await exited;
  expect((await acquired).event).toBe('result');
});

it.each(['logout', 'login'])('serializes %s behind a refresh in another process', async (action) => {
  writeStoredCredentials({ clientId: 'old-client', accessToken: 'old-access', refreshToken: 'old-refresh', expiresAt: Date.now() - 1000, scopes: [] });
  const refresh = start('refresh');
  expect((await message(refresh)).event).toBe('started');
  expect((await message(refresh)).event).toBe('request');
  const other = start(action);
  expect((await message(other)).event).toBe('started');
  const result = message(other);
  let finished = false;
  void result.then(() => { finished = true; });
  await new Promise((resolve) => setTimeout(resolve, 250));
  expect(finished).toBe(false);
  expect(readStoredCredentials()?.accessToken).toBe('old-access');
  const refreshed = message(refresh);
  refresh.send('continue');
  expect((await refreshed).token).toBe('rotated-access');
  expect(await result).toEqual({ event: 'result', code: 0 });
  if (action === 'logout') expect(readStoredCredentials()).toBeUndefined();
  else expect(readStoredCredentials()).toMatchObject({ clientId: 'new-client', accessToken: 'new-access', refreshToken: 'new-refresh', scopes: ['read'] });
});

it('shares one refresh between two separate server processes', async () => {
  writeStoredCredentials({ clientId: 'client', accessToken: 'old', refreshToken: 'old-refresh', expiresAt: Date.now() - 1000, scopes: [] });
  const first = start('refresh');
  expect((await message(first)).event).toBe('started');
  expect((await message(first)).event).toBe('request');
  const second = start('refresh');
  expect((await message(second)).event).toBe('started');
  const secondResult = message(second);
  const firstResult = message(first);
  first.send('continue');
  expect((await firstResult).token).toBe('rotated-access');
  expect(await secondResult).toEqual({ event: 'result', token: 'rotated-access' });
  expect(readStoredCredentials()?.refreshToken).toBe('rotated-refresh');
});
