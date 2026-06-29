# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: terminology.spec.ts >> Pengechekan Terminologi >> verifikasi teks Pengechekan muncul dan pelacakan tidak ada
- Location: e2e-tests/terminology.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=/pengechekan/i').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=/pengechekan/i').first()

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
  - heading "Dashboard Kinerja" [level=1]
  - paragraph: Pantau pencapaian tim Sales dan Team Leader secara real-time.
  - combobox:
    - option "Hari Ini"
    - option "Minggu Ini"
    - option "Bulan Ini" [selected]
    - option "Kustom Range..."
  - heading "New Leads" [level=3]
  - text: 142 +12 minggu ini
  - heading "Contacted" [level=3]
  - text: 89 +5 minggu ini
  - heading "Response" [level=3]
  - text: 54 Sama seperti minggu lalu
  - heading "Quotation" [level=3]
  - text: 32 +8 minggu ini
  - heading "Close Won" [level=3]
  - text: 18 +3 minggu ini
  - heading "Leaderboard Revenue Closing" [level=2]
  - heading "Keseluruhan (Sales)" [level=3]
  - heading "Per Team Leader" [level=3]
  - heading "Leaderboard Pembuatan Quotation" [level=2]
  - heading "Keseluruhan (Sales)" [level=3]
  - heading "Per Team Leader" [level=3]
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Pengechekan Terminologi', () => {
  4  |   test('verifikasi teks Pengechekan muncul dan pelacakan tidak ada', async ({ page, context }) => {
  5  |     await context.addCookies([
  6  |       { name: 'auth_token', value: 'dummy-token', domain: 'localhost', path: '/' },
  7  |       { name: 'auth_token', value: 'dummy-token', domain: '127.0.0.1', path: '/' }
  8  |     ]);
  9  |     await page.route('**/api/**', route => {
  10 |       route.fulfill({
  11 |         status: 200,
  12 |         contentType: 'application/json',
  13 |         body: JSON.stringify({ data: [] })
  14 |       });
  15 |     });
  16 |     // Navigasi ke halaman dasbor / root
  17 |     await page.goto('/');
  18 |     
  19 |     // Pastikan kata 'Pengechekan' ada di DOM
  20 |     const pengechekanText = page.locator('text=/pengechekan/i');
  21 |     
  22 |     // Karena mungkin ada beberapa elemen yang memuat 'Pengechekan', pastikan minimal ada 1
  23 |     // Tunggu sampai halaman termuat dan kita di route root
  24 |     await expect(page).toHaveURL('/');
  25 |     
> 26 |     await expect(pengechekanText.first()).toBeVisible();
     |                                           ^ Error: expect(locator).toBeVisible() failed
  27 |     
  28 |     // Pastikan JANGAN ADA kata 'pelacakan'
  29 |     const pelacakanText = page.locator('text=/pelacakan/i');
  30 |     await expect(pelacakanText).toHaveCount(0);
  31 |   });
  32 | });
  33 | 
```