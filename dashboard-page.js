const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.workpodSideNav = page.locator('[href="/admin/workpods"]');
        this.storefrontSideNav = page.locator('[href="/admin/storefronts"]');
        this.policySideNav = page.locator('[href="/admin/policies"]');
    }
    async PolicyNavigation () {
        await this.page.locator('[href="/admin/policies"]').click()
        await this.page.waitForLoadState('domcontentloaded')
    }
};