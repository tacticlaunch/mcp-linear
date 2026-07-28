import { spawn } from 'node:child_process';

/**
 * Best-effort attempt to open a URL in the user's default browser using the
 * platform launcher. Never throws; callers always print the URL as a
 * fallback.
 */
export function openBrowser(url: string): Promise<boolean> {
  let command: string;
  let args: string[];

  if (process.platform === 'darwin') {
    command = 'open';
    args = [url];
  } else if (process.platform === 'win32') {
    command = 'cmd';
    // The empty string is the window title placeholder `start` expects.
    args = ['/c', 'start', '', url];
  } else {
    command = 'xdg-open';
    args = [url];
  }

  return new Promise((resolve) => {
    try {
      const child = spawn(command, args, { stdio: 'ignore', detached: true });
      child.on('error', () => resolve(false));
      child.on('spawn', () => {
        child.unref();
        resolve(true);
      });
    } catch {
      resolve(false);
    }
  });
}
