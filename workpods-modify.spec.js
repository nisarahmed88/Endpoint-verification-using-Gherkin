const { test, expect } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { WorkpodPage } = require('../page-object/workpod-page')

import credentials from '../test_data/credentials.json'
import workpodData from '../test_data/workpod.json'

test.describe.configure({ mode: 'serial' });
let page;
let deleteWorkpodFlag;

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
    const workpodPage = new WorkpodPage(page)

    if (deleteWorkpodFlag) {
        await dashboardPage.workpodSideNav.waitFor();

        
        await dashboardPage.workpodSideNav.click()
        await page.waitForLoadState('load')

        await workpodPage.firstWorkpodName.waitFor();
        await workpodPage.deleteFirstWorkpod();
        await workpodPage.verfiyAlertByText('Workpod deleted.')
    }
})

test.afterAll(async () => {
    await page.close();
})

for (const record of workpodData.invalidInputWorkpods) {
    test(`${record.testName}`, async () => {
        const dashboardPage = new DashboardPage(page)
        const workpodPage = new WorkpodPage(page)
        deleteWorkpodFlag = false;

        await dashboardPage.workpodSideNav.click()
        await page.waitForLoadState('domcontentloaded')
        await workpodPage.addWorkpod.click()
        await page.waitForSelector('#wb-name-input');

        await workpodPage.workpodDescription.fill(record.description);
        await workpodPage.workpodName.click();
        if (record.descriptionErrorMsg !== '') {
            await expect(workpodPage.roleAlert).toContainText(record.descriptionErrorMsg)
        }
        await workpodPage.workpodDescription.clear();
        await workpodPage.workpodName.fill(record.name);
        await expect(workpodPage.roleAlert).toContainText(record.nameErrorMsg)
    })
}


for (const record of workpodData.validinputWorkpods) {
    test(`${record.testName}`, async () => {
        const dashboardPage = new DashboardPage(page)
        const workpodPage = new WorkpodPage(page)
        deleteWorkpodFlag = true;

        await dashboardPage.workpodSideNav.click()
        await page.waitForLoadState('domcontentloaded')
        await workpodPage.addWorkpod.click()
        await page.waitForSelector('#wb-name-input')
        await workpodPage.setNameAndDescription(record.name, record.description)

        if (record.applications.length > 0) {
            await workpodPage.addApplicationButton.click()
            await page.waitForLoadState('domcontentloaded')
            await workpodPage.checkAllCheckboxesFromJson(record.applications)
            await workpodPage.saveButton.click()
        }

        if (record.groups.length > 0) {
            await workpodPage.addUserGroupButton.click()
            await page.waitForLoadState('domcontentloaded')
            await workpodPage.checkAllCheckboxesFromJson(record.groups)
            await workpodPage.saveButton.click()
        }

        if (record.users.length > 0) {
            await workpodPage.addUserGroupButton.click()
            await workpodPage.userTab.click()
            await page.waitForLoadState('domcontentloaded')
            await workpodPage.checkAllCheckboxesFromJson(record.users)
            await workpodPage.saveButton.click()
        }

        await workpodPage.saveDraftButton.click()
        await workpodPage.verfiyAlertByText(workpodData.validationMessages.newDraftAlertMessage)
        await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)

        //For edge test case: Editing the workpod that has 0 application, group, and user
        if (record.users.length === 0 && record.groups.length === 0 && record.applications.length === 0) {
            await dashboardPage.workpodSideNav.waitFor();
            await dashboardPage.workpodSideNav.click()
            await workpodPage.draftsSection.click()
            await workpodPage.actionButton.click()
            await workpodPage.editOption.click()
            await workpodPage.editingAlert.isVisible()

            await workpodPage.setNameAndDescription(record.name, workpodData.autodeployValidationWorkpod.updatedDescription)
            await workpodPage.saveDraftButton.click()
            await workpodPage.verfiyAlertByText(workpodData.validationMessages.saveToDraftsMessage)
        }
    })
}
