const { test, expect } = require('@playwright/test');

test.describe('Sanity checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Sections exist', async ({ page }) => {
    const sections = [
      'Names', 
      'Emails', 
      'Persona', 
      'Passwords', 
      'Keys', 
      'Numbers', 
      'Date & Time', 
      'Phone numbers'
    ];
    
    for (const header of sections) {
      await expect(page.locator('h3').filter({ hasText: header }).first()).toBeVisible();
    }
  });

  test('The button works', async ({ page }) => {
    const button = page.locator('button > h2').filter({ hasText: 'Random8' });
    await expect(button).toBeVisible();
    await button.click();
  });

  test('There are tooltips', async ({ page }) => {
    const tooltipSections = ['Emails', 'Numbers'];
    
    for (const header of tooltipSections) {
      const tooltipText = page.locator(`h3:has-text("${header}") .tooltip .tooltiptext`);
      await expect(tooltipText).toBeAttached();
    }
  });
});