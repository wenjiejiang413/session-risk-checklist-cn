import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

await Promise.all([
  copyFile(resolve(root, 'data/checklist.zh-CN.json'), resolve(root, 'docs/checklist.zh-CN.json')),
  copyFile(resolve(root, 'src/evaluate.js'), resolve(root, 'docs/evaluate.js')),
]);

console.log('GitHub Pages assets synchronized.');
