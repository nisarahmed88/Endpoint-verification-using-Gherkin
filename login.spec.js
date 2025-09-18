const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page-object/login-page');
import credentials from '../test_data/credentials.json';

test('Validate the error of empty email', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.submitButton.click()
    await page.waitForTimeout(20000)
    await expect(await loginPage.userNameError).toContainText('Enter a valid email address, phone number, or Skype name.')
})

test('Validate the error of empty password', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.submitButton.click()
    await page.waitForTimeout(20000)
    await expect(await loginPage.passwordError).toContainText('Please enter your password.')
})

test('Validate the error of invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.invalidPassword)
    await page.waitForTimeout(20000)
    await expect(await loginPage.passwordError).toContainText("Your account or password is incorrect. If you don't remember your password, reset it now.")
})

test('Validate the error of invalid email', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.invalidEmail)
    await page.waitForTimeout(20000)
    await expect(await loginPage.userNameError).toContainText("This username may be incorrect. Make sure you typed it correctly. Otherwise, contact your admin.")
})

test('Validate that user1 is able to login', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email)
    await loginPage.enterPassword(credentials.login.invalidPassword)
    await page.title('Cloudpager')
})

test('Validate that user2 is able to login', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.openURL(credentials.login.url)
    await loginPage.signInMicrosoft.click()
    await loginPage.enterEmail(credentials.login.email2)
    await loginPage.enterPassword(credentials.login.invalidPassword)
    await page.title('Cloudpager')
})