'use strict';
// Per-reseller branding config + theme shell for the Data white-label dashboard.
const DEFAULTS = {
  name: "Data's Army Dashboard", logoUrl: '', primaryColor: '#2A78D6', accentColor: '#008300',
  textColor: '#18181B', backgroundColor: '#FAFAF9', fontFamily: 'system-ui, sans-serif',
  supportEmail: '', footerText: '', hidePoweredBy: false
};
const HEX = /^#[0-9a-fA-F]{6}$/;
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s).replace(/[&<>"']/g, c => MAP[c]);

function validateBranding(input = {}) {
  const errors = []; const b = { ...DEFAULTS, ...input };
  if (!input.slug || !/^[a-z0-9-]{2,40}$/.test(input.slug)) errors.push('slug must be 2-40 chars: a-z, 0-9, -');
  if (!b.name || String(b.name).length > 60) errors.push('name is required (max 60 chars)');
  for (const k of ['primaryColor', 'accentColor', 'textColor', 'backgroundColor'])
    if (!HEX.test(b[k])) errors.push(k + ' must be #RRGGBB');
  if (b.logoUrl && !/^https:\/\//.test(b.logoUrl)) errors.push('logoUrl must be https');
  if (b.supportEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.supportEmail)) errors.push('supportEmail is invalid');
  if (/[;{}<>]/.test(b.fontFamily)) errors.push('fontFamily has invalid characters');
  return { ok: errors.length === 0, errors, branding: b };
}

function themeCss(b) {
  return ':root{--wl-primary:' + b.primaryColor + ';--wl-accent:' + b.accentColor + ';--wl-text:' +
    b.textColor + ';--wl-bg:' + b.backgroundColor + ';--wl-font:' + b.fontFamily + ';}';
}

const BASE_CSS = 'body{margin:0;font-family:var(--wl-font);color:var(--wl-text);background:var(--wl-bg)}' +
  '.wl-header{display:flex;align-items:center;gap:12px;padding:12px 20px;background:var(--wl-primary);color:#fff}' +
  '.wl-logo{height:32px}main{padding:20px;max-width:1100px;margin:auto}' +
  '.wl-footer{padding:16px 20px;font-size:13px;border-top:3px solid var(--wl-accent);display:flex;gap:16px;flex-wrap:wrap}';

// Theme shell: header, main slot, footer. Page content goes into <main>.
function renderShell(input, bodyHtml = '') {
  const v = validateBranding(input);
  if (!v.ok) throw new Error('Invalid branding: ' + v.errors.join('; '));
  const b = v.branding;
  const logo = b.logoUrl ? '<img class="wl-logo" src="' + esc(b.logoUrl) + '" alt="' + esc(b.name) + ' logo">' : '';
  const powered = b.hidePoweredBy ? '' : '<span class="wl-powered">Powered by Data\'s Army</span>';
  const support = b.supportEmail ? '<a href="mailto:' + esc(b.supportEmail) + '">' + esc(b.supportEmail) + '</a>' : '';
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<title>' + esc(b.name) + '</title><style>' + themeCss(b) + BASE_CSS + '</style></head>' +
    '<body data-reseller="' + esc(b.slug) + '"><header class="wl-header">' + logo +
    '<span class="wl-name">' + esc(b.name) + '</span></header><main>' + bodyHtml + '</main>' +
    '<footer class="wl-footer"><span>' + esc(b.footerText) + '</span>' + support + powered + '</footer></body></html>';
}
module.exports = { DEFAULTS, validateBranding, themeCss, renderShell };
