'use strict';
// KPI dashboard page: parseCsv -> summarize() -> cards + table inside the reseller theme shell.
const { parseCsv, summarize } = require('./csv');
const { renderShell } = require('./branding');
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s).replace(/[&<>"']/g, c => MAP[c]);
const fmt = n => (Math.round(n * 100) / 100).toLocaleString('en-US');

const KPI_CSS = '<style>.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}' +
  '.kpi-card{background:#fff;border-radius:10px;padding:16px;border-top:4px solid var(--wl-primary);box-shadow:0 1px 3px rgba(0,0,0,.08)}' +
  '.kpi-label{font-size:13px;text-transform:uppercase;opacity:.7}.kpi-value{font-size:28px;font-weight:700;margin:6px 0}' +
  '.kpi-meta{font-size:12px;opacity:.7}.kpi-errors{margin-top:20px;color:#b42318}' +
  'table{width:100%;border-collapse:collapse;margin-top:20px}td,th{padding:6px 8px;border-bottom:1px solid #DEDDD8;text-align:left}</style>';

function renderKpiBody(summary, errors = []) {
  const metrics = Object.keys(summary).sort();
  const cards = metrics.map(m => {
    const s = summary[m];
    return '<div class="kpi-card" data-metric="' + esc(m) + '"><div class="kpi-label">' + esc(m) + '</div>' +
      '<div class="kpi-value">' + fmt(s.total) + '</div><div class="kpi-meta">' + s.count + ' rows, ' +
      esc(s.first) + ' to ' + esc(s.last) + ' (avg ' + fmt(s.total / s.count) + ')</div></div>';
  }).join('');
  const empty = metrics.length ? '' : '<p class="kpi-empty">No valid rows to show yet. Upload a CSV with date, metric and value columns.</p>';
  const errs = errors.length ? '<div class="kpi-errors"><strong>' + errors.length + ' row(s) skipped:</strong><ul>' +
    errors.slice(0, 50).map(e => '<li>Line ' + e.line + ': ' + esc(e.error) + '</li>').join('') + '</ul></div>' : '';
  return KPI_CSS + '<h1>KPI dashboard</h1><div class="kpi-grid">' + cards + '</div>' + empty + errs;
}

function renderKpiPage(branding, csvText) {
  const { records, errors } = parseCsv(csvText);
  return renderShell(branding, renderKpiBody(summarize(records), errors));
}
module.exports = { renderKpiBody, renderKpiPage };
