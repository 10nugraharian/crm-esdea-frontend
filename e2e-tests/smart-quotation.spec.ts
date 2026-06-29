import { test, expect } from '@playwright/test';

test.describe('Smart Quotation Logic', () => {
  test.beforeEach(async ({ page, context }) => {
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
    // Navigasi ke halaman Quotations
    await page.goto('/quotations');
    
    // Klik tombol Buat Quotation
    await page.getByRole('button', { name: /Buat Quotation/i }).click();
    
    // Pilih client agar tombol submit bisa di-enable (syarat: ada client terpilih)
    const clientInput = page.locator('input[list="leads-list"]');
    await clientInput.fill('PT. Tambang Alpha');
    await page.keyboard.press('Tab');

    // Pilih Layanan: Sertifikasi ISO
    const layananInput = page.locator('input[list="layanan-list"]');
    await layananInput.fill('Sertifikasi ISO');
    await page.keyboard.press('Tab');
    
    // Harga Pokok sudah terisi otomatis Rp 2.000.000 dari master data
  });

  test('Skenario A: Input Harga Jual normal', async ({ page }) => {
    // Input Harga Jual: Rp 2.400.000
    // Kolom Harga Jual adalah td ke-5 (index 4)
    const hargaJualInput = page.locator('tbody tr').first().locator('td').nth(4).locator('input');
    await hargaJualInput.fill('2400000');
    await page.keyboard.press('Tab');
    
    // Verifikasi tombol tertulis 'Buat Quotation' dan aktif
    const submitBtn = page.getByRole('button', { name: 'Buat Quotation' });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('Skenario B: Input Harga Jual dengan upping > Rp 500.000', async ({ page }) => {
    // Ubah Harga Jual menjadi Rp 2.600.000 (margin 600.000 -> melebihi limit)
    const hargaJualInput = page.locator('tbody tr').first().locator('td').nth(4).locator('input');
    await hargaJualInput.fill('2600000');
    await page.keyboard.press('Tab');
    
    // Verifikasi bahwa sistem langsung mendeteksi upping dan tombol otomatis berubah menjadi 'Request Approval'
    const submitBtn = page.getByRole('button', { name: 'Request Approval' });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
    
    // Pastikan tombol 'Buat Quotation' (yang normal) tidak ada lagi
    const normalSubmitBtn = page.getByRole('button', { name: 'Buat Quotation', exact: true });
    await expect(normalSubmitBtn).not.toBeVisible();
  });
});
