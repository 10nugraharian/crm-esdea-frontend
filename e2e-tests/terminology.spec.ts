import { test, expect } from '@playwright/test';

test.describe('Pengechekan Terminologi', () => {
  test('verifikasi teks Pengechekan muncul dan pelacakan tidak ada', async ({ page, context }) => {
    await context.addCookies([
      { name: 'auth_token', value: 'dummy-token', domain: 'localhost', path: '/' },
      { name: 'auth_token', value: 'dummy-token', domain: '127.0.0.1', path: '/' }
    ]);
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    });
    // Navigasi ke halaman dasbor / root
    await page.goto('/');
    
    // Pastikan kata 'Pengechekan' ada di DOM
    const pengechekanText = page.locator('text=/pengechekan/i');
    
    // Karena mungkin ada beberapa elemen yang memuat 'Pengechekan', pastikan minimal ada 1
    // Tunggu sampai halaman termuat dan kita di route root
    await expect(page).toHaveURL('/');
    
    await expect(pengechekanText.first()).toBeVisible();
    
    // Pastikan JANGAN ADA kata 'pelacakan'
    const pelacakanText = page.locator('text=/pelacakan/i');
    await expect(pelacakanText).toHaveCount(0);
  });
});
