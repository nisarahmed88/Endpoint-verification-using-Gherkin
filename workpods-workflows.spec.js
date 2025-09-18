const { test, expect } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { WorkpodPage } = require('../page-object/workpod-page')

import credentials from '../test_data/credentials.json'
import workpodData from '../test_data/workpod.json'

test.describe.configure({ mode: 'serial' });
let page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page)

    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await page.waitForLoadState('networkidle');
    await loginPage.enterPassword(credentials.login.password)
    await page.waitForLoadState('networkidle');
    await loginPage.staySignedInButton.waitFor()
    await loginPage.staySignedInButton.click()
    await page.title('Cloudpager')
    await page.waitForLoadState('networkidle');
});


test.afterAll(async () => {
    await page.close();
});

test.beforeEach(async () => {
    await page.waitForLoadState('networkidle');
});

for (const record of workpodData.workpodType) {
    test(`Validate that user is able to create the workpod and save it to ${record}.`, async () => {
        const dashboardPage = new DashboardPage(page)
        const workpodPage = new WorkpodPage(page)

        await dashboardPage.workpodSideNav.waitFor();
        await dashboardPage.workpodSideNav.click()
        await workpodPage.addWorkpod.click()
        await workpodPage.setNameAndDescription(workpodData.autodeployValidationWorkpod.name, workpodData.autodeployValidationWorkpod.description)
        await workpodPage.addApplicationButton.click()

        await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[0])
        await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[1])
        await workpodPage.saveButton.click()

        await workpodPage.addUserGroupButton.click()
        await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[2])
        await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[3])

        await workpodPage.userTab.click()
        await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[0])
        await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[1])
        await workpodPage.saveButton.click()

        if (record === "draft") {
            await workpodPage.saveDraftButton.click();
            await workpodPage.verfiyAlertByText(workpodData.validationMessages.newDraftAlertMessage);
            await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)
        } else {
            await workpodPage.publishButton.click();
            await workpodPage.enterPublishComment(workpodData.autodeployValidationWorkpod.comment)
            await workpodPage.verfiyAlertByText(workpodData.validationMessages.newPublishAlertMessage);
            await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)
        }
    })
}

// ! This is failng sporadically
test('Validate that user is able to edit the workpod and publish it', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)
    
    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.draftsSection.click()
    await page.waitForLoadState( 'networkidle');

    await workpodPage.goToEditThroughActionMenu();
    await workpodPage.editingAlert.isVisible();
    
    await workpodPage.setNameAndDescription(workpodData.autodeployValidationWorkpod.name, workpodData.autodeployValidationWorkpod.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[4])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[3])
    await workpodPage.saveButton.click()

    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[2])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[3])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[2])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[3])
    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click()

    await workpodPage.enterPublishComment(workpodData.autodeployValidationWorkpod.comment);
    await workpodPage.verfiyAlertByText(workpodData.validationMessages.publishWorkpodMessage);
})

test('Go to Published Workpod section and Edit any published workpod and then Saved it as a draft', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await page.waitForLoadState('networkidle');
    await workpodPage.firstWorkpodName.waitFor();
    await expect.soft(workpodPage.firstWorkpodName).toContainText(workpodData.autodeployValidationWorkpod.name)

    await workpodPage.goToEditThroughActionMenu();
    await workpodPage.editingAlert.isVisible()

    const randomName = workpodPage.generateString();
    await workpodPage.setNameAndDescription(randomName, workpodData.autodeployValidationWorkpod.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });

    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[2])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[3])
    await workpodPage.saveButton.click()

    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })

    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[1])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[1])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[2])
    await workpodPage.saveButton.click()
    await workpodPage.saveDraftButton.click();
    await workpodPage.verfiyAlertByText(workpodData.validationMessages.saveToDraftsMessage);
})

test('Go to Draft workpod, Edit it but dont save it, just discard at the end', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor();
    await dashboardPage.workpodSideNav.click()
    await workpodPage.draftsSection.click()
    await page.waitForLoadState('networkidle');
    await workpodPage.goToEditThroughActionMenu();
    await workpodPage.editingAlert.isVisible();
    

    await workpodPage.setNameAndDescription(workpodData.autodeployValidationWorkpod.name, workpodData.autodeployValidationWorkpod.updatedDescription)
    await workpodPage.addButtonInDraft.click({ force: true });
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[4])
    await workpodPage.saveButton.click()

    await workpodPage.groupAndUsers.click()
    await workpodPage.addButtonInDraft.click({ force: true })
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[0])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[1])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[1])
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[2])
    await workpodPage.saveButton.click();
    await workpodPage.discardDraft.click();
    await workpodPage.verfiyAlertByText(workpodData.validationMessages.removeFromDraftMessage);
})

test('Switching between the filters, draft, publish, and all', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await expect(page).toHaveURL(/.*all/)

    await workpodPage.draftsSection.click()
    await expect(page).toHaveURL(/.*draft/)

    await workpodPage.publishedSection.click()
    await expect(page).toHaveURL(/.*publish/)
})

test('Validate the change policy while user edit the workpod', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.addWorkpod.click()
    await workpodPage.setNameAndDescription(workpodData.autodeployValidationWorkpod.name, workpodData.autodeployValidationWorkpod.description)
    await workpodPage.addApplicationButton.click()

    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[1])
    await workpodPage.saveButton.click()

    await workpodPage.addUserGroupButton.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[1])

    await workpodPage.userTab.click()
    await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[1])
    await workpodPage.saveButton.click()
    await workpodPage.publishButton.click();

    await workpodPage.enterPublishComment(workpodData.autodeployValidationWorkpod.comment)
    await workpodPage.verfiyAlertByText(workpodData.validationMessages.newPublishAlertMessage);
    await expect.soft(workpodPage.successMessgae).toContainText(workpodData.validationMessages.workpodCreatedMessage)

    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await page.waitForLoadState('networkidle');
    await workpodPage.firstWorkpodCard.waitFor()
    await workpodPage.firstWorkpodCard.click()
    await workpodPage.editButton.click()
    await workpodPage.actionButtonsInEdit.first().click()
    await expect(workpodPage.changePolicyOption).toBeVisible()
})

test('Go to published workpods and user is able to see the view revision option', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await page.reload();
    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.firstWorkpodCard.waitFor()
    await workpodPage.firstWorkpodCard.click()
    await expect(workpodPage.viewRivisionBtn).toBeVisible()
})

test('Verify that user is able to see the revisions history section after 4 times edit the workpod', async () => {
    const editNames = ["Add applications for editing workpod", "Add groups for editing workpod", "Add users for editing workpod", "Remove a user for editing workpod"]
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.firstWorkpodCard.waitFor()
    await workpodPage.firstWorkpodCard.click();
    await page.waitForLoadState('networkidle');
    await expect(workpodPage.viewRivisionBtn).toBeVisible()

    for (let index = 0; index < editNames.length; index++) {
        await workpodPage.editButton.waitFor()
        await workpodPage.editButton.click()

        await workpodPage.workpodName.fill(editNames[index])

        switch (index) {
            case 0:
                await workpodPage.addButtonInDraft.click({ force: true });
                await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[1])
                await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.applications[6])
                await workpodPage.saveButton.click()
                break;

            case 1:
                await workpodPage.groupAndUsers.click()
                await workpodPage.addButtonInDraft.click({ force: true })
                await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[0])
                await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.groups[1])
                await workpodPage.saveButton.click()
                break;

            case 2:
                await workpodPage.groupAndUsers.click()
                await workpodPage.addButtonInDraft.click({ force: true })
                await workpodPage.userTab.click()
                await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[1])
                await workpodPage.clickOnCheckBoxByText(workpodData.autodeployValidationWorkpod.users[2])
                await workpodPage.saveButton.click()
                break;

            case 3:
                await workpodPage.groupAndUsers.click()
                await workpodPage.removeButtonEdit.last().click();
                break;
        }

        await workpodPage.publishButton.click()
        await workpodPage.enterPublishComment(workpodData.autodeployValidationWorkpod.comment);
        await workpodPage.verfiyAlertByText(workpodData.validationMessages.publishWorkpodMessage);
    }

    await workpodPage.editButton.waitFor()
    await workpodPage.viewRivisionBtn.waitFor()
    await workpodPage.viewRivisionBtn.click()
    await workpodPage.revisionHistoryItems.first().waitFor()
    await expect(workpodPage.revisionHistoryItems.first()).toBeVisible();
})

test('Validate the user is perform the copy as new draft on revisions', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.firstWorkpodCard.waitFor()
    await workpodPage.firstWorkpodCard.click()

    await workpodPage.editButton.waitFor()
    await workpodPage.editButton.click()
    await workpodPage.viewRivisionBtn.waitFor()
    await workpodPage.viewRivisionBtn.click()
    await workpodPage.revisionHistoryItems.first().waitFor()
    await expect(workpodPage.revisionHistoryItems.first()).toBeVisible();

    await workpodPage.revisionHistoryItems.last().click()
    await workpodPage.copyAsNewDraft.click();
    await workpodPage.verfiyAlertByText(workpodData.validationMessages.saveToDraftsMessage);
})

test('Validate the user is perform the rollback on revisions', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await workpodPage.publishedSection.click()
    await workpodPage.firstWorkpodCard.waitFor()
    await workpodPage.firstWorkpodCard.click()

    await workpodPage.editButton.waitFor()
    await workpodPage.editButton.click()
    await workpodPage.viewRivisionBtn.waitFor()
    await workpodPage.viewRivisionBtn.click()
    await workpodPage.revisionHistoryItems.first().waitFor()
    await expect(workpodPage.revisionHistoryItems.first()).toBeVisible();

    await workpodPage.revisionHistoryItems.last().click()
    await workpodPage.rollback.click()
    await workpodPage.rollbackWorkpod.click();
    await workpodPage.verfiyAlertByText(workpodData.validationMessages.publishWorkpodMessage);
})

for (const record of workpodData.workpodType) {
    test(`Go to ${record} tab and delete any workpod`, async () => {
        const dashboardPage = new DashboardPage(page)
        const workpodPage = new WorkpodPage(page)

        await dashboardPage.workpodSideNav.waitFor()
        await dashboardPage.workpodSideNav.click()
        if (record === "draft") {
            await workpodPage.draftsSection.click()
        }

        if (record === "publish") {
            await workpodPage.publishedSection.click()
        }

        await workpodPage.searchField.click()
        await workpodPage.searchField.fill(workpodData.autodeployValidationWorkpod.searchName)
        await workpodPage.firstWorkpodName.waitFor()
        await workpodPage.deleteFirstWorkpod();
        await workpodPage.verfiyAlertByText(workpodData.validationMessages.deleteWorkpodMessage);
    })
}
//Unable to automate Drag and drop operation

test.skip('Edit priority testcase', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    
    await workpodPage.editPriority.click()
    await workpodPage.continueBtn.click()
    await workpodPage.dragAndDropWorkpod()
    await workpodPage.verfiyAlertByText('Applications in this workpod will have deployment priority over');
})

test('Search of Workpods by name and delete all of them', async () => {
    const dashboardPage = new DashboardPage(page)
    const workpodPage = new WorkpodPage(page)

    await dashboardPage.workpodSideNav.waitFor()
    await dashboardPage.workpodSideNav.click()
    await page.waitForLoadState('networkidle')

    await workpodPage.deleteAllWorkpod(workpodData.autodeployValidationWorkpod.name, workpodData.validationMessages.deleteWorkpodMessage)
})