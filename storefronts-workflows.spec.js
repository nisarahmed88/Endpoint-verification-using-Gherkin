const { test, expect } = require('@playwright/test')
const { LoginPage } = require('../page-object/login-page')
const { DashboardPage } = require('../page-object/dashboard-page')
const { StoreFrontPage } = require('../page-object/storefront-page')

import credentials from '../test_data/credentials.json'
import storefrontData from '../test_data/storefront.json'

test.describe.configure({ mode: 'serial' });
let page;


test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page)

    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.password)
    await loginPage.submitButton.click()
    await page.title('Cloudpager')
});

test.afterAll(async () => {
    await page.close();
});

test('Validate that user is able to create the storefront and save to draft', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor();
    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.addStorefront.click()
    await storeFrontPage.setNameAndDescription(storefrontData.autodeployValidationStorefront.name, storefrontData.autodeployValidationStorefront.description)
    await storeFrontPage.addApplicationButton.click()

    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[0])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[1])
    await storeFrontPage.saveButton.click()

    await storeFrontPage.addUserGroupButton.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[2])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[3])

    await storeFrontPage.userTab.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[0])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[1])
    await storeFrontPage.saveButton.click()

    await storeFrontPage.saveDraftButton.click();
    await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.newDraftAlertMessage)
    await expect.soft(storeFrontPage.successMessgae).toContainText(storefrontData.validationMessages.storefrontCreatedMessage)
})

test('Validate that user is able to edit the storefront and publish it', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor();
    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.draftsSection.click()
    await storeFrontPage.actionStorefrontButton.click()
    await storeFrontPage.editOption.click()
    await storeFrontPage.editingAlert.isVisible()

    await storeFrontPage.setNameAndDescription(storefrontData.autodeployValidationStorefront.name, storefrontData.autodeployValidationStorefront.updatedDescription)
    await storeFrontPage.addButtonInDraft.click({ force: true });
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[4])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[3])
    await storeFrontPage.saveButton.click()

    await storeFrontPage.groupAndUsers.click()
    await storeFrontPage.addButtonInDraft.click({ force: true })
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[2])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[3])

    await storeFrontPage.userTab.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[2])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[3])
    await storeFrontPage.saveButton.click()
    await storeFrontPage.publishButton.click()

    await storeFrontPage.enterPublishComment(storefrontData.autodeployValidationStorefront.comment)
    await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.publishStorefrontMessage)

})

test('Go to Published storefront section and Edit any published storefront and then Saved it as a draft', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor();
    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.publishedSection.click()
    await storeFrontPage.firstStorefrontName.waitFor();
    await expect.soft(storeFrontPage.firstStorefrontName).toContainText(storefrontData.autodeployValidationStorefront.name)

    await storeFrontPage.actionStorefrontButton.click()
    await storeFrontPage.editOption.click()
    await storeFrontPage.editingAlert.isVisible()

    const randomString = storeFrontPage.generateString();
    await storeFrontPage.setNameAndDescription(storefrontData.autodeployValidationStorefront.name, storefrontData.autodeployValidationStorefront.updatedDescription + randomString)
    await storeFrontPage.addButtonInDraft.click({ force: true });

    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[2])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[3])
    await storeFrontPage.saveButton.click()

    await storeFrontPage.groupAndUsers.click()
    await storeFrontPage.addButtonInDraft.click({ force: true })

    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[0])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[1])

    await storeFrontPage.userTab.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[1])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[2])
    await storeFrontPage.saveButton.click()
    await storeFrontPage.saveDraftButton.click()
    await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.saveToDraftsMessage)
})

test('Go to Draft storefront, Edit it but dont save it, just discard at the end', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor();
    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.draftsSection.click()

    await storeFrontPage.firstStorefrontName.waitFor();
    await expect.soft(storeFrontPage.firstStorefrontName).toContainText(storefrontData.autodeployValidationStorefront.name)
    await storeFrontPage.actionStorefrontButton.click()
    await storeFrontPage.editOption.click()
    await storeFrontPage.editingAlert.isVisible()

    await storeFrontPage.setNameAndDescription(storefrontData.autodeployValidationStorefront.name, storefrontData.autodeployValidationStorefront.updatedDescription)
    await storeFrontPage.addButtonInDraft.click({ force: true });
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[0])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[4])
    await storeFrontPage.saveButton.click()

    await storeFrontPage.groupAndUsers.click()
    await storeFrontPage.addButtonInDraft.click({ force: true })
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[0])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[1])

    await storeFrontPage.userTab.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[1])
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[2])
    await storeFrontPage.saveButton.click()
    await storeFrontPage.discardStorefrontDraft.click()
    await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.removeFromDraftMessage)

})

test('Switching between the filters, draft, publish, and all', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor()
    await dashboardPage.storefrontSideNav.click()
    await expect(page).toHaveURL(/.*all/)

    await storeFrontPage.draftsSection.click()
    await expect(page).toHaveURL(/.*draft/)

    await storeFrontPage.publishedSection.click()
    await expect(page).toHaveURL(/.*publish/)
})

test('Validate the change policy while user edit the storefront', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor()
    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.addStorefront.click()
    await storeFrontPage.setNameAndDescription(storefrontData.autodeployValidationStorefront.name, storefrontData.autodeployValidationStorefront.description)
    await storeFrontPage.addApplicationButton.click()

    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[1])
    await storeFrontPage.saveButton.click()

    await storeFrontPage.addUserGroupButton.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[1])

    await storeFrontPage.userTab.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[1])
    await storeFrontPage.saveButton.click()
    await storeFrontPage.publishButton.click();

    await storeFrontPage.enterPublishComment(storefrontData.autodeployValidationStorefront.comment)
    await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.newPublishAlertMessage)
    await expect.soft(storeFrontPage.successMessgae).toContainText(storefrontData.validationMessages.storefrontCreatedMessage)

    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.publishedSection.click()
    await storeFrontPage.firstStorefrontCard.waitFor()
    await storeFrontPage.firstStorefrontCard.click()
    await storeFrontPage.editButton.click()
    await storeFrontPage.actionButtonsInEdit.first().click()
    await expect(storeFrontPage.changePolicyOption).toBeVisible()
})

test('Go to published storefronts and user is able to see the view revision option', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await page.reload();
    await dashboardPage.storefrontSideNav.waitFor()
    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.publishedSection.click()
    await storeFrontPage.firstStorefrontCard.waitFor()
    await storeFrontPage.firstStorefrontCard.click()
    await expect(storeFrontPage.viewRivisionBtn).toBeVisible()
})

test('Verify that user is able to create and veiw revisions', async () => {
    const editNames = ["create and view Add applications revision", "create and view Add groups revision", "create and view Add users revision", "create and view Remove a user revision"]
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor()
    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.publishedSection.click()
    await storeFrontPage.firstStorefrontCard.waitFor()
    await storeFrontPage.firstStorefrontCard.click()
    await expect(storeFrontPage.viewRivisionBtn).toBeVisible()

    for (let index = 0; index < editNames.length; index++) {
        await storeFrontPage.editButton.waitFor()
        await storeFrontPage.editButton.click()

        await storeFrontPage.storefrontName.fill(editNames[index])

        switch (index) {
            case 0:
                await storeFrontPage.addButtonInDraft.click({ force: true });
                await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[1])
                await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[6])
                await storeFrontPage.saveButton.click()
                break;

            case 1:
                await storeFrontPage.groupAndUsers.click()
                await storeFrontPage.addButtonInDraft.click({ force: true })
                await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[0])
                await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[1])
                await storeFrontPage.saveButton.click()
                break;

            case 2:
                await storeFrontPage.groupAndUsers.click()
                await storeFrontPage.addButtonInDraft.click({ force: true })
                await storeFrontPage.userTab.click()
                await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[1])
                await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[2])
                await storeFrontPage.saveButton.click()
                break;

            case 3:
                await storeFrontPage.groupAndUsers.click()
                await storeFrontPage.removeButtonEdit.last().click();
                break;
        }

        await storeFrontPage.publishButton.click()
        await storeFrontPage.enterPublishComment(storefrontData.autodeployValidationStorefront.comment)
        await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.publishStorefrontMessage)
    }

    await storeFrontPage.editButton.waitFor()
    await storeFrontPage.viewRivisionBtn.waitFor()
    await storeFrontPage.viewRivisionBtn.click()
    await storeFrontPage.revisionHistoryItems.first().waitFor()
    await expect(storeFrontPage.revisionHistoryItems.first()).toBeVisible();
})


test('Search Storefronts by name and delete all of them', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor()
    await dashboardPage.storefrontSideNav.click()
    await page.waitForLoadState('networkidle')

    await storeFrontPage.deleteAllStorefronts(storefrontData.autodeployValidationStorefront.name, storefrontData.validationMessages.deleteStorefrontMessage)
})

//Skipped it as it is failing
test.skip('Enabling and disabling the availability on storefront listing page', async () => {
    const dashboardPage = new DashboardPage(page)
    const storeFrontPage = new StoreFrontPage(page)

    await dashboardPage.storefrontSideNav.waitFor()
    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.addStorefront.click()
    await storeFrontPage.setNameAndDescription(storefrontData.autodeployValidationStorefront.name, storefrontData.autodeployValidationStorefront.description)
    await storeFrontPage.addApplicationButton.click()

    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.applications[1])
    await storeFrontPage.saveButton.click()

    await storeFrontPage.addUserGroupButton.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.groups[1])

    await storeFrontPage.userTab.click()
    await storeFrontPage.clickOnCheckBoxByText(storefrontData.autodeployValidationStorefront.users[1])
    await storeFrontPage.saveButton.click()
    await storeFrontPage.publishButton.click();

    await storeFrontPage.enterPublishComment(storefrontData.autodeployValidationStorefront.comment)
    await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.newPublishAlertMessage)
    await expect.soft(storeFrontPage.successMessgae).toContainText(storefrontData.validationMessages.storefrontCreatedMessage)

    await dashboardPage.storefrontSideNav.click()
    await storeFrontPage.publishedSection.click()

    await storeFrontPage.firstStorefrontCard.waitFor()
    await storeFrontPage.availabilityRadiBtn.first().waitFor()
    await storeFrontPage.availabilityRadiBtn.first().click()
    await storeFrontPage.takeOfflineBtn.click()
    await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.disableStorefrontMessage)

    await storeFrontPage.availabilityRadiBtn.first().waitFor()
    await storeFrontPage.availabilityRadiBtn.first().click()
    await expect.soft(storeFrontPage.alertDialog).toContainText(storefrontData.validationMessages.enableStorefrontMessage)
})

