const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');

const appUrl = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;

async function signInAsSuperadmin(page) {
  await page.goto(appUrl);
  await page.locator('#loginEmail').fill('superadmin@hope.com');
  await page.locator('#loginPassword').fill('demo-password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.locator('#dashboard')).toBeVisible();
}

test('signs in with a demo account and renders the dashboard', async ({ page }) => {
  await signInAsSuperadmin(page);

  await expect(page.locator('#pageTitle')).toHaveText('Dashboard');
  await expect(page.locator('#roleBadge')).toHaveText('superadmin');
  await expect(page.getByText('Welcome back, Kurt Thomas Jon!')).toBeVisible();
});

test('renders each implemented module for a superadmin', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await signInAsSuperadmin(page);

  const modules = [
    ['customers', 'Customer Management'],
    ['products', 'Product Management'],
    ['hr', 'Human Resources'],
    ['sales', 'Sales Management'],
    ['reports', 'Reports'],
    ['users', 'User Management']
  ];

  for (const [module, title] of modules) {
    await page.evaluate(name => window.navigateTo(name), module);
    await expect(page.locator('#pageTitle')).toHaveText(title);
    await expect(page.locator('#contentArea')).not.toBeEmpty();
  }

  expect(pageErrors).toEqual([]);
});

test('signs out and clears the persisted session', async ({ page }) => {
  await signInAsSuperadmin(page);
  await page.getByRole('button', { name: 'Sign out' }).click();

  await expect(page.locator('#landing')).toBeVisible();
  await expect(page.locator('#dashboard')).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('hope_erp_session_v4'))).toBeNull();
});
