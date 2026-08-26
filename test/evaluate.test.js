import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { evaluate } from '../src/evaluate.js';

const checklist = JSON.parse(await readFile(
  new URL('../data/checklist.zh-CN.json', import.meta.url),
  'utf8',
));

const lowerRisk = {
  credentials: 'no',
  ownership: 'own',
  payment: 'clear',
  delivery: 'clear',
  aftersales: 'both',
  tracking: 'yes',
  claims: 'no',
};

test('returns LOWER_RISK for a complete low-score answer set', () => {
  const result = evaluate(checklist, lowerRisk);
  assert.equal(result.level, 'LOWER_RISK');
  assert.equal(result.score, 0);
  assert.equal(result.critical, false);
});

test('critical credentials answer always returns STOP', () => {
  const result = evaluate(checklist, { ...lowerRisk, credentials: 'yes' });
  assert.equal(result.level, 'STOP');
  assert.equal(result.critical, true);
});

test('scores information gaps into CHECK_FIRST and HIGH_RISK', () => {
  const check = evaluate(checklist, {
    ...lowerRisk,
    ownership: 'unclear',
    payment: 'partial',
  });
  assert.equal(check.level, 'CHECK_FIRST');

  const high = evaluate(checklist, {
    ...lowerRisk,
    ownership: 'unclear',
    payment: 'unclear',
    delivery: 'none',
    aftersales: 'none',
  });
  assert.equal(high.level, 'HIGH_RISK');
});

test('rejects missing or unknown answers', () => {
  assert.throws(
    () => evaluate(checklist, { ...lowerRisk, claims: 'maybe' }),
    /Invalid or missing answer for claims/,
  );
  const { tracking, ...missing } = lowerRisk;
  assert.equal(tracking, 'yes');
  assert.throws(
    () => evaluate(checklist, missing),
    /Invalid or missing answer for tracking/,
  );
});
