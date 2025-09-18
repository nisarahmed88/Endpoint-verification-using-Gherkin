const { test, expect } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { WorkpodPage } = require('../page-object/workpod-page')

import credentials from '../test_data/credentials.json'
import workpodData from '../test_data/workpod.json'
let page

test.describe.configure({ mode: 'serial' })

test.beforeAll(async ({browser}) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page)

    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.password)
    await loginPage.submitButton.click()
    await page.title('Cloudpager')
    await page.waitForLoadState('domcontentloaded');
});

test.afterAll(async () => {
    await page.close()
});

test('Create the workpod and publish it with the adobe reader and notepad++ applications and UAT1 user', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.autodeployValidationWorkpod.name, workpodData.autodeployValidationWorkpod.description)
    await workpodPage.addApplicationButton.click()

    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[5])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[6])
    await workpodPage.saveButton.click()

    await workpodPage.addUserGroupButton.click()
    await workpodPage.userTab.click()

    await workpodPage.searchInModal.waitFor()
    await workpodPage.searchInModal.fill(workpodData.autodeployValidationWorkpod.users[4])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[4])

    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click()

    await workpodPage.enterPublishComment(workpodData.autodeployValidationWorkpod.comment)
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.newPublishAlertMessage)
    await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)
})

test('Edit the same workpod and remove adobe reader applications from it and and re-publish it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.searchField.click()
    await workpodPage.searchField.fill(workpodData.autodeployValidationWorkpod.name)
    await workpodPage.firstWorkpodName.waitFor()

    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()
    await workpodPage.removeApplication(workpodData.autodeployValidationWorkpod.applications[6])
    await workpodPage.publishButton.click()

    await workpodPage.enterPublishComment(workpodData.autodeployValidationWorkpod.comment)
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.publishWorkpodMessage)
})


test('Edit the same workpod and add adobe reader, 7 zip applications and re-publish it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.searchField.click()
    await workpodPage.searchField.fill(workpodData.autodeployValidationWorkpod.name)
    await workpodPage.firstWorkpodName.waitFor()

    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.addButtonInDraft.click({ force: true });
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[5])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[7])
    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click()

    await workpodPage.enterPublishComment(workpodData.autodeployValidationWorkpod.comment)
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.publishWorkpodMessage)
})

test('Edit the same workpod and remove only UAT1 user and add auto user 1, re-publish it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.searchField.click()
    await workpodPage.searchField.fill(workpodData.autodeployValidationWorkpod.name)
    await workpodPage.firstWorkpodName.waitFor()

    await workpodPage.actionButton.click()
    await workpodPage.editOption.click()
    await workpodPage.editingAlert.isVisible()

    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })
    await workpodPage.userTab.click()
    
    await workpodPage.searchInModal.waitFor()
    await workpodPage.searchInModal.fill(workpodData.autodeployValidationWorkpod.users[4])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[4])

    await workpodPage.searchInModal.fill(workpodData.autodeployValidationWorkpod.users[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[0])

    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click()

    await workpodPage.enterPublishComment(workpodData.autodeployValidationWorkpod.comment)
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.publishWorkpodMessage)
})


/*
test('Delete the same workpod in the end', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()

    await workpodPage.searchField.click()
    await workpodPage.searchField.fill(workpodData.autodeployValidationWorkpod.name)
    await workpodPage.firstWorkpodName.waitFor()
    await workpodPage.deleteFirstWorkpod()
    await expect.soft(workpodPage.alertDialog).toContainText(workpodData.validationMessages.deleteWorkpodMessage)
})*/
