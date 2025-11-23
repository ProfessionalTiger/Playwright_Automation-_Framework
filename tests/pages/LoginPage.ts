import { Page } from '@playwright/test';
import { BasePage } from './basePage.ts';

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
    await this.page.fill(this.usernameInput, "aamirs");
    await this.page.fill(this.passwordInput, "123");
    await this.page.click(this.loginButton);
    await this.page.waitForURL('**/dashboard');
    await this.page.waitForLoadState('networkidle');
    await this.page.click(this.workspacesetting);
    await this.page.click(this.workspace);
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.page.locator(this.usernameInput).isVisible();
  }
}