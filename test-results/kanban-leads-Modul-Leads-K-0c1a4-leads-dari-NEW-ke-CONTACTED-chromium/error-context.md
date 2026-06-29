# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kanban-leads.spec.ts >> Modul Leads (Kanban View) >> drag and drop kartu leads dari NEW ke CONTACTED
- Location: e2e-tests/kanban-leads.spec.ts:20:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('div').filter({ hasText: /^NEW$/ }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('div').filter({ hasText: /^NEW$/ }).first()

```

```yaml
- banner:
  - img "Esdea Logo"
  - textbox "Global Search"
  - button
  - text: BOD User
- complementary:
  - navigation:
    - link "Dashboard":
      - /url: /
    - link "Leads":
      - /url: /leads
    - link "Distribusi Leads":
      - /url: /distribusi-leads
    - link "Quotations":
      - /url: /quotations
    - link "Invoices":
      - /url: /invoices
    - link "Layanan":
      - /url: /layanan
    - link "Finance":
      - /url: /finance
    - link "Projects":
      - /url: /projects
    - link "Vendors":
      - /url: /vendors
    - link "Komisi":
      - /url: /komisi
    - link "Tim":
      - /url: /users
    - link "Hak Akses":
      - /url: /akses
- main:
  - heading "Leads" [level=1]
  - button "Table View"
  - button "Kanban View"
  - button "Import CSV"
  - button "Export"
  - button "Create Lead"
  - heading "NEW" [level=3]
  - text: "1"
  - heading "PT. ABADI" [level=4]
  - text: HOT U -
  - heading "CONTACTED" [level=3]
  - text: "0"
  - heading "RESPONSE" [level=3]
  - text: "0"
  - heading "QUOTATION" [level=3]
  - text: "0"
  - heading "WON" [level=3]
  - text: "0"
  - heading "LOST" [level=3]
  - text: "0"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Modul Leads (Kanban View)', () => {
  4  |   test.beforeEach(async ({ page, context }) => {
  5  |     await context.addCookies([
  6  |       { name: 'auth_token', value: 'dummy-token', domain: 'localhost', path: '/' },
  7  |       { name: 'auth_token', value: 'dummy-token', domain: '127.0.0.1', path: '/' }
  8  |     ]);
  9  |     await page.route('**/api/**', route => {
  10 |       route.fulfill({
  11 |         status: 200,
  12 |         contentType: 'application/json',
  13 |         body: JSON.stringify({ data: [
  14 |           { id: '1', status_leads: 'NEW', nama_perusahaan: 'PT. ABADI', kualifikasi: 'HOT' }
  15 |         ]})
  16 |       });
  17 |     });
  18 |   });
  19 | 
  20 |   test('drag and drop kartu leads dari NEW ke CONTACTED', async ({ page }) => {
  21 |     // Navigasi ke halaman leads
  22 |     await page.goto('/leads');
  23 |     
  24 |     // Pastikan berada di mode Kanban (bisa dengan klik tombol switch view)
  25 |     const kanbanButton = page.locator('button[title="Kanban View"]');
  26 |     await kanbanButton.click();
  27 |     
  28 |     // Verifikasi kolom Kanban muncul
  29 |     const newColumn = page.locator('div').filter({ hasText: /^NEW$/ }).first();
  30 |     const contactedColumn = page.locator('div').filter({ hasText: /^CONTACTED$/ }).first();
  31 |     
> 32 |     await expect(newColumn).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
  33 |     await expect(contactedColumn).toBeVisible();
  34 |     
  35 |     // Temukan kartu 'PT. ABADI' di kolom NEW
  36 |     const leadCard = page.locator('div').filter({ hasText: 'PT. ABADI' }).first();
  37 |     await expect(leadCard).toBeVisible();
  38 |     
  39 |     // Lakukan drag-and-drop dari kartu ke kolom CONTACTED
  40 |     await leadCard.dragTo(contactedColumn);
  41 |     
  42 |     // Verifikasi error tidak muncul
  43 |     const errorAlert = page.locator('.text-red-600', { hasText: /error|gagal/i });
  44 |     await expect(errorAlert).not.toBeVisible();
  45 |   });
  46 | });
  47 | 
```