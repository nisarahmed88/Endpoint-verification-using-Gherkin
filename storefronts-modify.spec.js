const { test, expect } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { StoreFrontPage } = require('../page-object/storefront-page')

import credentials from '../test_data/credentials.json'
import storefrontData from '../test_data/storefront.json'

test.describe.configure({ mode: 'serial' });
let page;
let deleteStorefrontFlag;


test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page)

    
    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.password)
    await loginPage.submitButton.click()
    await page.title('Cloudpager')
})

test.afterEach(async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    if (deleteStorefrontFlag) {
        await dashboardPage.storefrontSideNav.waitFor();
        await dashboardPage.storefrontSideNav.click()
        await page.waitForLoadState('load')

        await storeFrontPage.firstStorefrontName.waitFor();
        await storeFrontPage.deleteFirstStorefront();
        await storeFrontPage.verfiyAlertByText(storefrontData.validationMessages.deleteStorefrontMessage)
    }
})

test.afterAll(async () => {
    await page.close();
})

for (const record of storefrontData.invalidInputStorefronts) {
    test(`${record.testName}`, async () => {
        const dashboardPage = new DashboardPage(page)
        const storeFrontPage = new StoreFrontPage(page)
        deleteStorefrontFlag = false;

        await dashboardPage.storefrontSideNav.click()
        await page.waitForLoadState('domcontentloaded')
        await storeFrontPage.addStorefront.click()
        await page.waitForSelector('#sf-name-input');

    
        await storeFrontPage.storefrontDescription.fill(record.description);
        await storeFrontPage.storefrontName.click();
        if (record.descriptionErrorMsg !== '') {
            await expect(storeFrontPage.roleAlert).toContainText(record.descriptionErrorMsg)
        }
        await storeFrontPage.storefrontDescription.clear();
        await storeFrontPage.storefrontName.fill(record.name);
       
        await expect(storeFrontPage.roleAlert).toContainText(record.nameErrorMsg)
    })
}

for (const record of storefrontData.validinputStorefronts) {
    test(`${record.testName}`, async () => {
        const dashboardPage = new DashboardPage(page)
        const storeFrontPage = new StoreFrontPage(page)
        deleteStorefrontFlag = true;

        await dashboardPage.storefrontSideNav.click()
        await page.waitForLoadState('domcontentloaded')
        await storeFrontPage.addStorefront.click()
        await page.waitForSelector('#sf-name-input')
        await storeFrontPage.setNameAndDescription(record.name, record.description)

        if (record.applications.length > 0) {
            await storeFrontPage.addApplicationButton.click()
            await page.waitForLoadState('domcontentloaded')
            await storeFrontPage.checkAllCheckboxesFromJson(record.applications)
            await storeFrontPage.saveButton.click()
        }

        if (record.groups.length > 0) {
            await storeFrontPage.addUserGroupButton.click()
            await page.waitForLoadState('domcontentloaded')
            await storeFrontPage.checkAllCheckboxesFromJson(record.groups)
            await storeFrontPage.saveButton.click()
        }

        if (record.users.length > 0) {
            await storeFrontPage.addUserGroupButton.click()
            await storeFrontPage.userTab.click()
            await page.waitForLoadState('domcontentloaded')
            await storeFrontPage.checkAllCheckboxesFromJson(record.users)
            await storeFrontPage.saveButton.click()
        }

        await storeFrontPage.saveDraftButton.click()
        await storeFrontPage.verfiyAlertByText(storefrontData.validationMessages.newDraftAlertMessage)
        await expect.soft(storeFrontPage.successMessgae).toContainText(storefrontData.validationMessages.storefrontCreatedMessage)

        //For edge test case: Editing the storefront that has 0 application, group, and user
        if (record.users.length === 0 && record.groups.length === 0 && record.applications.length === 0) {
            await dashboardPage.storefrontSideNav.waitFor();
            await dashboardPage.storefrontSideNav.click()
            await storeFrontPage.draftsSection.click()
            await storeFrontPage.actionStorefrontButton.click()
            await storeFrontPage.editOption.click()
            await storeFrontPage.editingAlert.isVisible()

            await storeFrontPage.setNameAndDescription(record.name, storefrontData.autodeployValidationStorefront.updatedDescription)
            await storeFrontPage.saveDraftButton.click()
            await storeFrontPage.verfiyAlertByText(storefrontData.validationMessages.saveToDraftsMessage)
        }
    })
}
