'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { renderKpiPage, renderKpiBody } = require('../src/kpi');
const { parseCsv, summarize } = require('../src/csv');
const root = path.join(__dirname, '..');
const brand = JSON.parse(fs.readFileSync(path.join(root, 'themes/example-reseller.json'), 'utf8'));
const csv = fs.readFileSync(path.join(root, 'samples/sample.csv'), 'utf8');

const html = renderKpiPage(brand, csv);
const sum = summarize(parseCsv(csv).records);
for (const m of Object.keys(sum)) assert(html.includes('data-metric="' + m + '"'), 'card for ' + m);
assert(html.includes('<main>') && html.includes('KPI dashboard'), 'inside theme shell');
assert(renderKpiBody({ '<x>': { total: 1, count: 1, first: '2026-01-01', last: '2026-01-01' } }).includes('&lt;x&gt;'), 'escapes metric');
assert(renderKpiBody({}).includes('kpi-empty'), 'empty state');
const bad = renderKpiPage(brand, 'date,metric,value\n2026-01-01,leads,5\nnope,leads,3\n');
assert(bad.includes('1 row(s) skipped') && bad.includes('Line 3'), 'reports bad rows');
console.log('kpi: 5 passed');
