import { Page } from '@playwright/test';
import { BasePage } from './basePage.js';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  readonly usernameInput = '[name="username"]';
  readonly passwordInput = '[name="password"]';
  readonly loginButton = 'button[id="submit"]';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(this.usernameInput, "student");
    await this.page.fill(this.passwordInput, "Password123");
    await this.page.click(this.loginButton);
    await this.page.waitForURL('**/logged-in-successfully');
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.page.locator(this.usernameInput).isVisible();
  }
}