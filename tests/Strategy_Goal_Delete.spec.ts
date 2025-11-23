import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://deltadefenders-qa.elixirlab.net/web/tango');
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.goto('https://deltadefenders-qa.elixirlab.net/elixir/default/dashboard');
  await page.waitForTimeout(4000);
 await page.locator('#settings-svg').click();
 await page.waitForTimeout(2000);
  await page.getByText('Workspace').click();
  await page.waitForTimeout(8000);
  await page.getByText('Strategy').click();
  await page.waitForTimeout(2000);
  await page.getByRole('link', { name: 'Goals' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('row', { name: 'Auto_Test' }).getByTestId('action-button').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByText('AS', { exact: true }).click();
  await page.getByText('Logout').click();
});