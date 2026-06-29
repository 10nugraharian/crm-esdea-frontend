import { test, expect } from '@playwright/test';

test.describe('Modul Leads (Kanban View)', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      { name: 'auth_token', value: 'dummy-token', domain: 'localhost', path: '/' },
      { name: 'auth_token', value: 'dummy-token', domain: '127.0.0.1', path: '/' }
    ]);
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [
          { id: '1', status_leads: 'NEW', nama_perusahaan: 'PT. ABADI', kualifikasi: 'HOT' }
        ]})
      });
    });
  });

  test('drag and drop kartu leads dari NEW ke CONTACTED', async ({ page }) => {
    // Navigasi ke halaman leads
    await page.goto('/leads');
    
    // Pastikan berada di mode Kanban (bisa dengan klik tombol switch view)
    const kanbanButton = page.locator('button[title="Kanban View"]');
    await kanbanButton.click();
    
    // Verifikasi kolom Kanban muncul
    const newColumn = page.locator('h3').filter({ hasText: 'NEW' }).first();
    const contactedColumn = page.locator('h3').filter({ hasText: 'CONTACTED' }).first();
    
    await expect(newColumn).toBeVisible();
    await expect(contactedColumn).toBeVisible();
    
    // Temukan kartu 'PT. ABADI' di kolom NEW
    const leadCard = page.locator('div').filter({ hasText: 'PT. ABADI' }).first();
    await expect(leadCard).toBeVisible();
    
    // Lakukan drag-and-drop dari kartu ke kolom CONTACTED
    await leadCard.dragTo(contactedColumn);
    
    // Verifikasi error tidak muncul
    const errorAlert = page.locator('.text-red-600', { hasText: /error|gagal/i });
    await expect(errorAlert).not.toBeVisible();
  });
});
