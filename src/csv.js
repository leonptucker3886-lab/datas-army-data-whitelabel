'use strict';
// CSV upload parser for the Data white-label dashboard. No dependencies.
// Handles quoted fields, escaped quotes, CRLF/LF, BOM, blank lines.
const REQUIRED = ['date', 'metric', 'value'];

function splitRows(text) {
  const rows = []; let row = []; let field = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (q) throw new Error('Unclosed quote in CSV');
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => !(r.length === 1 && r[0].trim() === ''));
}

function parseCsv(text, opts = {}) {
  const maxRows = opts.maxRows || 50000;
  if (typeof text !== 'string') throw new Error('CSV input must be a string');
  const rows = splitRows(text.replace(/^\uFEFF/, ''));
  if (!rows.length) throw new Error('CSV is empty');
  const header = rows[0].map(h => h.trim().toLowerCase());
  const missing = REQUIRED.filter(h => !header.includes(h));
  if (missing.length) throw new Error('Missing required column(s): ' + missing.join(', '));
  if (rows.length - 1 > maxRows) throw new Error('Too many rows (max ' + maxRows + ')');
  const records = []; const errors = [];
  rows.slice(1).forEach((r, idx) => {
    const line = idx + 2; const o = {};
    header.forEach((h, j) => { o[h] = (r[j] || '').trim(); });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(o.date) || isNaN(Date.parse(o.date))) { errors.push({ line, error: 'Invalid date: ' + o.date }); return; }
    if (!o.metric) { errors.push({ line, error: 'Missing metric' }); return; }
    const v = Number(o.value.replace(/[$,]/g, ''));
    if (o.value === '' || !Number.isFinite(v)) { errors.push({ line, error: 'Invalid value: ' + o.value }); return; }
    o.value = v; records.push(o);
  });
  return { columns: header, records, errors };
}

// Totals per metric for the KPI dashboard.
function summarize(records) {
  const out = {};
  for (const r of records) {
    const m = out[r.metric] || (out[r.metric] = { total: 0, count: 0, first: r.date, last: r.date });
    m.total += r.value; m.count++;
    if (r.date < m.first) m.first = r.date;
    if (r.date > m.last) m.last = r.date;
  }
  return out;
}
module.exports = { parseCsv, summarize, REQUIRED };
