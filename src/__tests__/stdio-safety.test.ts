import fs from 'node:fs';
import path from 'node:path';

function collectSourceFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__tests__') {
        continue;
      }
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('stdio safety', () => {
  it('does not use console.log in production source files', () => {
    const srcDir = path.resolve(process.cwd(), 'src');
    const sourceFiles = collectSourceFiles(srcDir);
    const offenders = sourceFiles.filter((filePath) => fs.readFileSync(filePath, 'utf8').includes('console.log('));

    expect(offenders).toEqual([]);
  });
});
