const { expect } = require('@playwright/test')
const MAX_RETRIES = 5;
exports.WorkpodPage = class WorkpodPage {

    
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page
        this.addWorkpod = page.locator('span.mat-button-wrapper', { hasText: ' Add Workpod ' })
        this.workpodName = page.locator('#wb-name-input')
        this.workpodDescription = page.locator('[formcontrolname="workpodDescription"]')
        this.addApplicationButton = page.locator('#add-app-btn')
        this.addUserGroupButton = page.locator('#add-user-group-btn')
        this.table = page.locator('table[role="grid"]')
        this.saveButton = page.locator('.dialog-button-container button.btn-save')
        this.saveDraftButton = page.locator('.save-publish-container button.btn-secondary')
        this.publishButton = page.locator('.save-publish-container button.btn-primary')
        this.alertDialog = page.locator('[role="alertdialog"]')
        this.successMessgae = page.locator('#header')
        this.userTab = page.locator('div.dialog-content div.mat-tab-label-content', { hasText: 'Users' })
        this.draftsSection = page.locator('span.mat-button-toggle-label-content', { hasText: ' Drafts ' })
        this.publishedSection = page.locator('span.mat-button-toggle-label-content', { hasText: ' Published ' })
        this.actionButton = page.locator('div.wb-card-actions').first();
        this.editOption = page.locator('span.action-label', { hasText: 'Edit' }).first();
        this.deleteOption = page.locator('span.action-label', { hasText: 'Delete' }).first();
        this.manageAdminsOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Manage Admins' })
        this.editingAlert = page.locator('span.alert-text')
        this.addButtonInDraft = page.locator('div.mat-tab-label-content button')
        this.groupAndUsers = page.locator('.mat-tab-label-content', { hasText: 'Groups & Users' })
        this.publishCommentField = page.locator('#publish-comment')
        this.publishBtnModal = page.locator('#publish-btn')
        this.confirmWorkpodNameField = page.locator('input[formcontrolname="confirmName"]')
        this.deleteBtnInModal = page.locator('#confirm-btn')
        this.firstWorkpodName = page.locator('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title')
        this.discardDraft = page.locator('#delete-wb-btn')
        this.roleAlert = page.locator('[role="alert"]')
        this.searchInModal = page.locator('[role="dialog"] .mat-form-field-infix input')
        this.firstWorkpodCard = page.locator('div.drag-drop-list>div:first-child div.wb-card')
        this.editButton = page.locator('button.view-edit-top-btn')
        this.actionButtonsInEdit = page.locator('#app-table button.actions-button')
        this.changePolicyOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Change Policy' })
        this.removeApplicationOption = page.locator('div[role="menu"] span.action-label', { hasText: 'Remove Application' })
        this.viewRivisionBtn = page.locator('div.revision-btn')
        this.revisionHistoryItems = page.locator('.revision-panel .revision-item')
        this.copyAsNewDraft = page.locator('button span.mat-button-wrapper', { hasText: ' Copy as New Draft ' })
        this.rollback = page.locator('button span.mat-button-wrapper', { hasText: ' Rollback ' })
        this.rollbackWorkpod = page.locator('[role="dialog"] #confirm-btn')
        this.removeButtonEdit = page.locator('td.mat-column-remove button')
        this.searchField = page.locator('#search-input')
        this.editPriority = page.locator('button.edit-priority-btn')
        this.continueBtn = page.locator('#confirm-btn span.mat-button-wrapper', { hasText: ' Continue ' })
    }

    async clickOnCheckBox(index) {
        const checkbox = this.page.locator(`tbody tr:nth-child(${index}) td:nth-child(1) span.mat-checkbox-inner-container`)
        await checkbox.click()
        //expect(await checkbox.isChecked()).toBeTruthy()
    }

    async clickOnCheckBoxByText(name) {
        const checkbox = this.page.locator(`//div[@class="dialog-content"]//td[contains(text(),"${name}")]`)
        await checkbox.first().click()
        //await expect(checkbox).toBeTruthy()
    }
    

    async setNameAndDescription(name, description) {
        await this.workpodName.clear()
        await this.workpodName.fill(name)
        await this.workpodDescription.clear()
        await this.workpodDescription.fill(description)
    }
    

    async enterPublishComment(comment) {
        await this.publishCommentField.fill(comment)
        await this.publishBtnModal.click()
    }

    async enterWorkpodNameAndDelete(name) {
        await this.confirmWorkpodNameField.fill(name)
        await this.deleteBtnInModal.click()
    }

    async firstWorkpodText() {
        await this.page.evaluate(() => {
            const parentElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title');
            const childElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title badge');
            const parentText = parentElement.textContent.split(childElement.textContent);
            return parentText[0];
        });
    }

    async deleteFirstWorkpod() {
        const workpodName = await this.page.evaluate(() => {
            const parentElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title');
            const childElement = document.querySelector('.cdk-drop-list.drag-drop-list > div:first-child div.wb-title badge');
            const parentText = parentElement.textContent.split(childElement.textContent);
            return parentText[0];
        });

        await this.actionButton.click()
        await this.deleteOption.click()
        await this.enterWorkpodNameAndDelete(workpodName.trim());
    }

    generateString(length = 12) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    async checkAllCheckboxes(length = null) {
        await this.page.waitForSelector('tbody tr:nth-child(1) td:nth-child(1) span.mat-checkbox-inner-container')
        const checkboxes = await this.page.$$('tbody tr td:nth-child(1) span.mat-checkbox-inner-container');
        let checkboxesCount = checkboxes.length;

        if (length === null) {
            length = checkboxesCount;
        }

        for (let i = 0; i < length; i++) {
            await checkboxes[i].click();
        }
    }

    async checkAllCheckboxesFromJson(namesArray) {
        for (let i = 0; i < namesArray.length; i++) {
            await this.clickOnCheckBoxByText(namesArray[i])
        }
    }

    async verfiyAlertByText(text) {
        const alert = await this.page.locator(`//*[@role="alertdialog" and contains(text(), "${text}")]`);
        await alert.waitFor();
        await expect.soft(alert).toBeVisible()
    }

    async removeApplication(name) {
        await this.page.waitForSelector('tbody[role="rowgroup"] tr[role="row"]:first-child td:nth-child(2)')
        const elements = await this.page.$$('tbody[role="rowgroup"] tr[role="row"] td:nth-child(2)');

        for (let index = 1; index <= elements.length; index++) {
            const text = await elements[index].textContent();
            if (text.includes(name)) {
                await this.page.locator(`tbody[role="rowgroup"] tr[role="row"]:nth-child(${index}) td:nth-child(7) button`).click();
                await this.removeApplicationOption.click();
                return;
            }
        }

        console.log(`Element with text "${name}" not found.`);
    }

    async dragAndDropWorkpod() {
        await this.page.waitForSelector('button.save-btn')
        await this.page.waitForLoadState('networkidle')
        // await this.page.waitForSelector('button.save-btn')
        // await this.page.locator('(//div[@class="wb-card-details"])[1]').dragTo(this.page.locator('(//div[@class="wb-card-details"])[2]'))
        // await this.page.locator('(//div[@class="cdk-drag draggable-item"])[1]').hover();
        // await this.page.mouse.down();
        // await this.page.waitForTimeout(500)
        // await this.page.locator('(//div[@class="cdk-drag draggable-item"])[2]').hover();
        // await this.page.mouse.up();
        const source = this.page.locator('(//div[@class="wb-card"])[1]');
        const target = this.page.locator('(//div[@class="wb-card"])[2]');

        //await source.dragTo(target);
        // or specify exact positions relative to the top-left corners of the elements:
        // await source.dragTo(target, {
        //     sourcePosition: { x: 200, y: 20 },
        //     targetPosition: { x: 200, y: 40 },
        // });

        await this.page.dragAndDrop('(//div[@class="wb-card"])[1]', '(//div[@class="wb-card"])[3]')
    }

    async goToEditThroughActionMenu() {
        let attempts = 0;
        while (attempts < MAX_RETRIES) {
            try {
                await this.actionButton.click({timeout: 5000})
                if (await this.editOption.isDisabled({timeout: 5000})) {
                    console.warn ("Edit option did not appear, retrying....");
                    attempts++;
                } else {
                    await this.editOption.click({timeout: 5000});   
                    if (await this.editingAlert.isVisible({timeout: 5000})) {
                        return;
                    } else {
                        console.warn ("Edit button clicked but navigation did not work, retrying....");
                        attempts++;
                    }
                }
            } catch (err) {
                attempts++;
                console.warn ("Attempt to click on edit failed, retrying....");
            }
        }
        throw "Failed to navigate to edit page through action menu.";
    }

    async deleteAllWorkpod(searchName, messageText) {
        await this.searchField.click()
        await this.searchField.fill(`${searchName}`, { delay: 100 });
        await this.searchField.press('Enter');

        await this.page.waitForLoadState('networkidle')
        const noWorkpodFound = await this.page.locator('span.no-entities-title');
        await this.page.waitForSelector('div.drag-drop-list>div:first-child')
        const workpods = await this.page.$$('div.drag-drop-list>div');

        console.log(workpods.length);

        for (let i = 0; i < workpods.length; i++) {
            const elementFlag = await noWorkpodFound.isVisible()
            if (elementFlag) {
                break;
            }

            await this.deleteFirstWorkpod()
            await this.verfiyAlertByText(messageText)

            await this.searchField.waitFor();
            await this.searchField.click()
            await this.searchField.fill(searchName, { delay: 100 });
            await this.searchField.press('Enter');
            await this.page.waitForTimeout(2000) // This timeout is used because search functionality took some time to update the DOM
        }
    }
}
