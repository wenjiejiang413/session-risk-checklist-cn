#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { evaluate } from './evaluate.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const inputArg = args.find((arg) => !arg.startsWith('--'));

if (!inputArg) {
  console.error('Usage: node src/cli.js <answers.json> [--json]');
  process.exitCode = 1;
} else {
  try {
    const [checklistText, answersText] = await Promise.all([
      readFile(resolve(root, 'data/checklist.zh-CN.json'), 'utf8'),
      readFile(resolve(process.cwd(), inputArg), 'utf8'),
    ]);
    const result = evaluate(JSON.parse(checklistText), JSON.parse(answersText));

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`${result.level}: ${result.title}`);
      console.log(`Score: ${result.score}`);
      for (const note of result.notes) console.log(`- ${note}`);
      console.log(`Note: ${result.disclaimer}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
