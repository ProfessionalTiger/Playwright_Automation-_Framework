import { Page } from '@playwright/test';
import { BasePage } from './basePage.ts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  readonly usernameInput = '[id="_58_login"]';
  readonly passwordInput = '[id="_58_password"]';
  readonly loginButton = 'button[type="submit"]';
  readonly workspacesetting = '[name="Settings"]';
  readonly workspace = '[xpath="//span[normalize-space()=\'Workspace\']"]';
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
    await this.page.waitForURL('**/dashboard');
    await this.page.waitForLoadState('load');
    await this.page.waitForTimeout(3000);
    await this.page.click(this.workspacesetting);
    await this.page.click(this.workspace);
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.page.locator(this.usernameInput).isVisible();
  }
}