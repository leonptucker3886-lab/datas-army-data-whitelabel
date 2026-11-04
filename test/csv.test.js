'use strict';
const assert = require('assert'); const fs = require('fs'); const path = require('path');
const { parseCsv, summarize } = require('../src/csv');
let n = 0; const t = (name, fn) => { fn(); n++; console.log('ok -', name); };
t('parses sample.csv', () => {
  const r = parseCsv(fs.readFileSync(path.join(__dirname, '../samples/sample.csv'), 'utf8'));
  assert.strictEqual(r.records.length, 8); assert.strictEqual(r.errors.length, 0);
  assert.strictEqual(r.records[0].value, 12450);
  const s = summarize(r.records);
  assert.strictEqual(s.leads.total, 158); assert.strictEqual(s.revenue.count, 4);
  assert.strictEqual(s.revenue.last, '2026-10-26');
});
t('quotes, escaped quotes, CRLF, BOM', () => {
  const r = parseCsv('\uFEFFDate,Metric,Value,Note\r\n2026-01-01,a,1,"x, ""y"""\r\n');
  assert.strictEqual(r.records[0].note, 'x, "y"');
});
t('missing column rejected', () => assert.throws(() => parseCsv('date,value\n2026-01-01,1'), /metric/));
t('empty rejected', () => assert.throws(() => parseCsv('  \n'), /empty/));
t('unclosed quote rejected', () => assert.throws(() => parseCsv('date,metric,value\n2026-01-01,"a,1'), /quote/));
t('bad rows reported by line, good rows kept', () => {
  const r = parseCsv('date,metric,value\n2026-13-45,a,1\n2026-01-02,,1\n2026-01-03,a,abc\n2026-01-04,a,5\n');
  assert.deepStrictEqual(r.errors.map(e => e.line), [2, 3, 4]); assert.strictEqual(r.records.length, 1);
});
t('row limit', () => assert.throws(() => parseCsv('date,metric,value\n2026-01-01,a,1\n2026-01-01,a,1', { maxRows: 1 }), /Too many/));
console.log(n + ' csv tests passed');
