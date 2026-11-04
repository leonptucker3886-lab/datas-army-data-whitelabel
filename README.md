# Data's Army: Data White-Label

A data-reporting product that local agencies and resellers can sell under their own brand to small local businesses.

## Scope (v1)
- **Who it's for:** local sellers (agencies, POS resellers, consultants) who serve small businesses.
- **What the end client gets:** a branded dashboard and a weekly one-page PDF report built from their own data (CSV upload first, integrations later).
- **Core v1 features:**
  - CSV upload with column mapping
  - Simple KPIs: revenue, top items, trends, week-over-week change
  - Weekly PDF report
  - Per-reseller branding: logo, colors, name, domain
- **Out of v1:** live POS integrations, AI forecasting claims, billing automation.
- **Rules:** no paid services or new accounts without Leon's sign-off. No accuracy claims until checked against real data.

## White-label how-to (outline)
1. **Brand config:** one `brand.json` per reseller (name, logo URL, primary/accent colors, support email, footer text).
2. **Theming:** CSS variables read from brand config; no hard-coded brand names anywhere.
3. **Domain:** reseller points a subdomain (e.g. `reports.theiragency.com`) at the deploy.
4. **Client onboarding:** reseller adds a client, uploads a sample CSV, confirms column mapping.
5. **Reports:** PDF template pulls brand config, so every report carries the reseller's brand.
6. **Pricing:** resellers pay Data's Army **$99/month per reseller client** (set 4 Nov 2026, confirmed by Leon). Suggested resale to the end client: about $199-$249/month.
7. **QA checklist:** brand swap test, CSV edge cases, PDF render, mobile at 375 px.

## Status
- [ ] Brand config + theming shell
- [ ] CSV upload and mapping
- [ ] KPI dashboard
- [ ] Weekly PDF
- [ ] Browser-test PDF for the live tester
