import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('GitHub Pages uses the same checklist and evaluator as the CLI', async () => {
  const files = await Promise.all([
    readFile(new URL('../data/checklist.zh-CN.json', import.meta.url), 'utf8'),
    readFile(new URL('../docs/checklist.zh-CN.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/evaluate.js', import.meta.url), 'utf8'),
    readFile(new URL('../docs/evaluate.js', import.meta.url), 'utf8'),
  ]);
  assert.equal(files[0], files[1]);
  assert.equal(files[2], files[3]);
});
