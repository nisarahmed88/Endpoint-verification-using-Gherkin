const { expect } = require('@playwright/test')

exports.PolicyPage = class PolicyPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    
    constructor(page) {
        this.page = page
        this.addPolicy = page.locator('span.mat-button-wrapper', { hasText: 'Policy' })
        this.policyName = page.locator('#policy-name-input')
        this.policyDescription = page.locator('[formcontrolname="policyDescription"]')
        this.addApplicationButton = page.locator('#select-application')
        this.roleAlert = page.locator('[role="alert"]')
        this.FirstPlaceHolderError = page.locator('[role="alert"]').nth(0)
        this.SecondPlaceHolderError = page.locator('[role="alert"]').nth(1)
        this.ThirdPlaceHolderError = page.locator('[role="alert"]').nth(2)
        this.FourthPlaceHolderError = page.locator('[role="alert"]').nth(3)
        this.saveButton = page.locator('.dialog-button-container button.btn-save')
        this.savePolicyButton = page.locator('#publish-new-wb')
        this.successMessage = page.locator('#header')
        this.editPolicy = page.locator('span.mat-button-wrapper', { hasText: 'Edit' })
        this.searchField = page.locator('#search-input')
        this.moreOptions = page.locator('mat-icon.more-action-icon', { hasText: 'more_horiz' })
        this.deleteOption = page.locator('span', { hasText: 'Delete' })
        this.deletePolicy = page.locator('span.mat-button-wrapper', { hasText: 'Delete' })
        this.saveAfterEditButton = page.locator('span.mat-button-wrapper', { hasText: 'Save' })
        //after first toggle
        this.firsttoggledOption = page.locator('.mat-slide-toggle-thumb').first()
        this.maxseats = page.getByLabel('Maximum Seats', { exact: true })
        this.maxseatsplaceholder = page.getByPlaceholder('Maximum Seats')
        this.maximumdesktops = page.getByLabel('Maximum Desktops (Devices) Per User')
        this.maximumdesktopsplaceholder = page.getByPlaceholder('Maximum Desktops (Devices) Per User')
        //2nd toggle
        this.datetoggledOption = page.locator('.mat-slide-toggle-thumb').nth(1)
        //after 3rd toggle
        this.secondtoggledOption = page.locator('.mat-slide-toggle-thumb').nth(2)
        this.maxdays = page.getByLabel('Maximum Days Allowed for Offline Use', { exact: true })
        this.maxdaysplaceholder = page.getByPlaceholder('Maximum Days Allowed for Offline Use')
        this.maxdaysreset = page.getByText('DetailsPolicy Name * A value must be provided Description * A value must be prov')
        //LastToggle
        this.lasttoggle = page.locator('.mat-slide-toggle-thumb').nth(3)

        this.maximumSeatsOnEdit = page.getByRole("textbox", {exact: true}).nth(3)
        this.maximumDesktopPerUserOnEdit = page.getByRole("textbox", {exact: true}).nth(4)
        this.maxDaysOnEdit = page.getByRole("textbox", {exact: true}).nth(9)

        this.alertMessageDialog = page.getByRole("alertdialog",{exact: true})
        //this.WaitforLoadState = page.waitForTimeout(8000)
    
    }
    async WaitforLoadState() {
        await this.page.waitForTimeout(8000);
    }
     

    async SoftwareReclamation (days) {
    function getFormattedDay() {
            const currentDate = new Date();
            const day = currentDate.getDate();
            return day.toString();
    }
    const formattedDay = getFormattedDay();
    await this.page.getByLabel('Open calendar').click();
    await this.page.getByText(formattedDay, { exact: true }).click();
    await this.page.getByLabel('Inactivity Limit (Days)').click();
    await this.page.getByPlaceholder('Inactivity Limit (Days)').fill(days);
    }

    async search (name) {
        await this.page.getByPlaceholder('Search').fill(name);
        await this.page.getByPlaceholder('Search').press('Enter');
    }

    async sort () {
        await this.page.getByText("LAST MODIFIED").click()
        await this.page.waitForTimeout(3000)
        await this.page.getByText("LAST MODIFIED").click()
    }
    async newDeletion () {
        await this.page.getByText("LAST MODIFIED").click()
        await this.page.waitForTimeout(3000)
        await this.page.getByText("LAST MODIFIED").click()
        await this.page.locator('.mat-cell > .mat-focus-indicator').first().click()
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.waitForTimeout(3000)
        await this.page.getByRole('button', { name: 'Delete' }).click();
    }

    async deletion () {
           // Loop to delete all policies
    while (true) {
    const policy = this.page.locator('.mat-cell > .mat-focus-indicator').first();
    if (!policy) {
      // No more policies found, exit the loop
      break;
    }
    await this.page.waitForTimeout(3000)
    await policy.click();
    await this.page.waitForTimeout(2000)
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await this.page.waitForTimeout(3000)
    await this.page.getByRole('button', { name: 'Delete' }).click();
    await this.page.waitForTimeout(10000)
  }
    }
    async setNameAndDescription(name, description) {
        await this.policyName.fill(name)
        await this.policyDescription.fill(description)
    }
    async checkAllCheckboxesFromJson(namesArray) {
        for (let i = 0; i < namesArray.length; i++) {
            await this.clickOnCheckBoxByText(namesArray[i])
        }
    }
    async clickOnCheckBoxByText(name) {
        const checkbox = this.page.locator(`//div[@class="dialog-content"]//td[contains(text(),"${name}")]`)
        await checkbox.first().click()
    }
    async verfiyAlertByText(text) {
        const alert = await this.page.locator(`//*[@role="alertdialog" and contains(text(), "${text}")]`);
        await this.page.waitForTimeout(5000)
        await expect.soft(alert).toBeVisible()
    }
    async viewPolicy(text) {
        const policy = await this.page.locator(`//td[contains(text(), "${text}")]`);
        let waitForLoadState =await this.page.waitForTimeout(5000)
        await policy.first().click()
        await this.page.waitForTimeout(5000)
    }
    async verfiyPolicyDescription(text) {
        await expect(this.policyDescription).toHaveValue(text);
    }
    async deleteFirstPolicy() {
        await this.moreOptions.click()
        await this.deleteOption.click()
        await this.deletePolicy.click()
    }
    async deleteAllPolicies(searchName, messageText) {
        await this.searchField.click()
        await this.searchField.fill(`${searchName}`, { delay: 100 });
        await this.searchField.press('Enter');
        await this.page.waitForTimeout(2000) // This timeout is used because search functionality took some time to update the DOM

        const noPoliciesFound = await this.page.locator('td', { hasText: 'No policies found for' })
        const policies = await this.page.$$('table tr');

        console.log(policies.length);

        for (let i = 0; i < policies.length; i++) {
            const elementFlag = await noPoliciesFound.isVisible()
            if (elementFlag) {
                break;
            }

            await this.deleteFirstStorefront()
            // await this.verfiyAlertByText(messageText)
            await this.page.waitForTimeout(2000)
            await this.searchField.waitFor()
            await this.searchField.click()
            await this.searchField.fill(searchName, { delay: 100 });
            await this.searchField.press('Enter');
            await this.page.waitForTimeout(2000) // This timeout is used because search functionality took some time to update the DOM
        }
    }
}