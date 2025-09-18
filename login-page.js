const { expect } = require('@playwright/test');
exports.LoginPage = class LoginPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.signInMicrosoft = page.locator('span.mat-button-wrapper');
        this.emailField = page.locator('input[type="email"]');
        this.submitButton = page.locator('input[type="submit"]');
        this.staySignedInButton = page.locator('input[value="Yes"]');
        this.passwordField = page.locator('input[name="passwd"]');
        this.userNameError = page.locator('#usernameError');
        this.passwordError = page.locator('#passwordError');
        this.errorInfo = page.locator('#error_Info');
    }

    async openURL(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }

    async enterEmail(email) {
        //await expect(this.emailField).toBeVisible();
        await this.emailField.type(email);
        await this.submitButton.click();
    }

    async enterPassword(password) {
        //await expect(this.passwordField).toBeVisible();
        await this.passwordField.type(password);
        await this.submitButton.click();
    }
};