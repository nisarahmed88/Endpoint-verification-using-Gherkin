const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../page-object/login-page");
const { DashboardPage } = require("../page-object/dashboard-page");
const { PolicyPage } = require("../page-object/policy-page");

import credentials from "../test_data/credentials.json";
import policyData from "../test_data/policy.json";

test.describe.configure({ mode: "serial" });
let page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.openURL(credentials.login.url);
  await loginPage.signInMicrosoft.click();
  await loginPage.enterEmail(credentials.login.email);
  await page.waitForLoadState("networkidle");
  await loginPage.enterPassword(credentials.login.password);
  await page.waitForLoadState("networkidle");
  await loginPage.staySignedInButton.waitFor();
  await loginPage.staySignedInButton.click();
  await page.title("Cloudpager");
  await page.waitForLoadState("networkidle");
});

test.afterAll(async () => {
  await page.close();
});

for (const record of policyData.invalidInputPolicy) {
  test(`${record.testName}`, async () => {
    const dashboardPage = new DashboardPage(page);
    const policyPage = new PolicyPage(page);
    await policyPage.WaitforLoadState();
    await dashboardPage.PolicyNavigation();
    await policyPage.addPolicy.click();
    await page.waitForSelector("#policy-name-input");
    if (record?.applications) {
      await policyPage.addApplicationButton.click();
      await page.waitForLoadState("domcontentloaded");
      await policyPage.checkAllCheckboxesFromJson(record.applications);
      await policyPage.saveButton.click();
    }
    await policyPage.policyDescription.fill(record.description);
    await policyPage.policyName.click();
    await policyPage.policyName.fill(record.name);
    await policyPage.policyDescription.click();
    await policyPage.policyName.click();
    if (record?.nameErrorMsg || record?.descriptionErrorMsg) {
      await expect(policyPage.FirstPlaceHolderError).toContainText(
        record.nameErrorMsg
      );
      await expect(policyPage.SecondPlaceHolderError).toContainText(
        `${record.descriptionErrorMsg}`
      );
      await policyPage.policyDescription.clear();
    }
    await page.waitForLoadState("networkidle");
    if (record?.deploymentConstraint?.maximumSeat) {
      await policyPage.firsttoggledOption.setChecked(
        record.deploymentConstraint.toggle
      );
      await policyPage.maxseats.click();
      await policyPage.maxseatsplaceholder.fill(
        record.deploymentConstraint.maximumSeat.value
      );
      await policyPage.maximumdesktops.click();
      await expect(policyPage.ThirdPlaceHolderError).toContainText(
        record.deploymentConstraint.maximumSeat.errorMsg
      );

      if (record?.deploymentConstraint?.maximumDesktop) {
        await policyPage.maximumdesktopsplaceholder.fill(
          record.deploymentConstraint.maximumDesktop.value
        );
        await policyPage.maxseats.click();
        await expect(policyPage.ThirdPlaceHolderError).toContainText(
          record.deploymentConstraint.maximumDesktop.errorMsg
        );
      }
    }
    if (record?.deploymentConstraintsOnly) {
      await policyPage.firsttoggledOption.setChecked(
        record.deploymentConstraintsOnly.toggle
      );
      await policyPage.savePolicyButton.click();
      await expect(policyPage.alertMessageDialog).toHaveText(
        record.deploymentConstraintsOnly.errorMsg
      );
      await page.waitForLoadState("networkidle");
    }
    if (record?.offlineUsageOnly) {
      await policyPage.secondtoggledOption.setChecked(
        record.offlineUsageOnly.toggle
      );
      await policyPage.savePolicyButton.click();
      await expect(policyPage.alertMessageDialog).toHaveText(
        record.offlineUsageOnly.errorMsg
      );
      await page.waitForLoadState("networkidle");
    }
    if (record?.softwareReclamationOnly) {
      await policyPage.datetoggledOption.setChecked(
        record.softwareReclamationOnly.toggle
      );
      await policyPage.savePolicyButton.click();
      await expect(policyPage.alertMessageDialog).toHaveText(
        record.softwareReclamationOnly.errorMsg
      );
      await page.waitForLoadState("networkidle");
    }
    if (record?.turnAllToggleButtonOn) {
      await policyPage.firsttoggledOption.setChecked(
        record.turnAllToggleButtonOn.deploymentConstraint.toggle
      );
      await policyPage.secondtoggledOption.setChecked(
        record.turnAllToggleButtonOn.offlineUsage.toggle
      );
      await policyPage.datetoggledOption.setChecked(
        record.turnAllToggleButtonOn.softwareReclamation.toggle
      );
      await policyPage.savePolicyButton.click();
      await expect(policyPage.alertMessageDialog).toContainText(
        record.turnAllToggleButtonOn.errorMsg
      );
      await page.waitForLoadState("networkidle");
    }
  });
}

for (const record of policyData.invalidToggleButtonInputPolicy) {
  test(`${record.testName}`, async () => {
    const dashboardPage = new DashboardPage(page);
    const policyPage = new PolicyPage(page);
    await policyPage.WaitforLoadState();
    await dashboardPage.PolicyNavigation();
    await policyPage.addPolicy.click();
    await page.waitForSelector("#policy-name-input");

    await policyPage.policyName.click();
    await policyPage.policyName.fill(record.name);
    await policyPage.policyDescription.click();
    await policyPage.policyDescription.fill(record.description);
    await page.waitForLoadState("networkidle");

    //First Toggle
    await policyPage.firsttoggledOption.setChecked(
      record.deploymentConstraints.toggle
    );
    //Negative
    await policyPage.maxseats.click();
    await policyPage.maxseatsplaceholder.fill(
      record.deploymentConstraints.maximumSeats.value
    );
    await policyPage.maximumdesktops.click();
    await expect(policyPage.FirstPlaceHolderError).toContainText(
      record.deploymentConstraints.maximumSeats.errorMsg
    );
    //Second toggle
    await policyPage.secondtoggledOption.setChecked(
      record.deploymentConstraints.toggle
    );
    //Negative
    await policyPage.maxdays.click();
    await policyPage.maxdaysplaceholder.fill(record.offlineUsage.maxDays.value);
    await policyPage.policyName.click();
    await expect(policyPage.SecondPlaceHolderError).toContainText(
      record.offlineUsage.maxDays.errorMsg
    );
  });
}

for (const record of policyData.validInputPolicy) {
  test(`${record.testName}`, async () => {
    const dashboardPage = new DashboardPage(page);
    const policyPage = new PolicyPage(page);
    await policyPage.WaitforLoadState();
    await dashboardPage.PolicyNavigation();
    await policyPage.addPolicy.click();
    await page.waitForSelector("#policy-name-input");
    await policyPage.setNameAndDescription(record.name, record.description);

    await policyPage.addApplicationButton.click();
    await page.waitForLoadState("domcontentloaded");
    await policyPage.checkAllCheckboxesFromJson(record.applications);
    await policyPage.saveButton.click();
    //Deployment Contraints
    if (record?.deploymentConstraints?.maximumSeats) {
      await policyPage.firsttoggledOption.setChecked(
        record.deploymentConstraints.toggle
      );
      await policyPage.maxseats.click();
      await policyPage.maxseatsplaceholder.fill(
        record.deploymentConstraints.maximumSeats
      );
      if (record?.deploymentConstraints?.maximumDesktopPerUser) {
        await policyPage.maximumdesktops.click();
        await policyPage.maximumdesktopsplaceholder.fill(
          record.deploymentConstraints.maximumDesktopPerUser
        );
      }
      if (record?.deploymentConstraints?.toggleOff == false) {
        await policyPage.firsttoggledOption.setChecked(
          record?.deploymentConstraints?.toggleOff
        );
      }
    }
    //Software Reclamation
    if (record.softwareReclamation?.inactivedays) {
      await policyPage.datetoggledOption.setChecked(
        record.softwareReclamation.toggle
      );
      await policyPage.SoftwareReclamation(
        record.softwareReclamation?.inactivedays
      );
    }
    //Offline Usage
    if (record?.offlineUsage?.maxDays) {
      await policyPage.secondtoggledOption.setChecked(
        record.offlineUsage.toggle
      );
      await policyPage.maxdays.click();
      await policyPage.maxdaysplaceholder.fill(record.offlineUsage.maxDays);
    }
    if (record?.offlineUsage?.toggleOff == false) {
      await policyPage.secondtoggledOption.setChecked(
        record?.offlineUsage?.toggleOff
      );
    }
    //Paging optimizations
    if (record?.pagingOptimizations?.pageEntireAppset?.toggle == true) {
      await policyPage.lasttoggle.setChecked(
        record.pagingOptimizations?.pageEntireAppset?.toggle
      );
      await policyPage.lasttoggle.setChecked(false);
      await page.waitForLoadState("networkidle");
      await policyPage.lasttoggle.setChecked(
        record.pagingOptimizations?.pageEntireAppset?.toggle
      );
      await page.waitForLoadState("networkidle");
    }
    if (record?.pagingOptimizations?.pageEntireAppset?.toggle == false) {
      await policyPage.lasttoggle.setChecked(
        record.pagingOptimizations?.pageEntireAppset?.toggle
      );
    }
    //Saving
    await policyPage.savePolicyButton.click();
    await page.waitForLoadState("networkidle");
    //await policyPage.verfiyAlertByText(policyData.validationMessages.newPolicyAlertMessage)
    await expect(policyPage.alertMessageDialog).toContainText(
      `${policyData.validationMessages.policyCreationSucessMessage}`
    );
    //The policy New policy 2 has been created successfully.
    await page.waitForLoadState("networkidle");
    //delete policy
    await dashboardPage.PolicyNavigation();
    await page.waitForLoadState("networkidle");
    await policyPage.newDeletion();
    await page.waitForLoadState("networkidle");
  });
}

test("Validate that user is able to create the policy with both Deployment Constraint and Offline Usage Controls enabled in it with 100 value passed to all related fields. Now delete this policy to perform cleaning operation.", async () => {
  const dashboardPage = new DashboardPage(page);
  const policyPage = new PolicyPage(page);

  await dashboardPage.PolicyNavigation();
  await policyPage.WaitforLoadState();
  await policyPage.addPolicy.click();
  await page.waitForSelector("#policy-name-input");
  await policyPage.setNameAndDescription(
    policyData.createAndUpdatePolicy.name,
    policyData.createAndUpdatePolicy.description
  );

  await policyPage.addApplicationButton.click();
  await page.waitForLoadState("networkidle");
  await policyPage.checkAllCheckboxesFromJson(
    policyData.createAndUpdatePolicy.applications
  );
  await policyPage.saveButton.click();
  await page.waitForLoadState("networkidle");

  //setting toggle values to 100
  //first toggle
  await policyPage.firsttoggledOption.setChecked(
    policyData.createAndUpdatePolicy.deploymentConstraints.toggle
  );
  await policyPage.maxseats.click();
  await policyPage.maxseatsplaceholder.fill(
    policyData.createAndUpdatePolicy.deploymentConstraints.maximumSeats
  );
  await policyPage.maximumdesktops.click();
  await policyPage.maximumdesktopsplaceholder.fill(
    policyData.createAndUpdatePolicy.deploymentConstraints.maximumDesktopPerUser
  );

  //Second toggle
  await policyPage.secondtoggledOption.setChecked(
    policyData.createAndUpdatePolicy.offlineUsage.toggle
  );
  await policyPage.maxdays.click();
  await policyPage.maxdaysplaceholder.fill(
    policyData.createAndUpdatePolicy.offlineUsage.maxDays
  );

  await policyPage.savePolicyButton.click();
  await page.waitForLoadState("networkidle");
  await expect(policyPage.alertMessageDialog).toContainText(
    `${policyData.validationMessages.policyCreationSucessMessage}`
  );
  await page.waitForLoadState("networkidle");
});
test("Validate that user is able to create the duplicate policy with both Deployment Constraint and Offline Usage Controls enabled in it with 100 value passed to all related fields. Now delete this policy to perform cleaning operation..", async () => {
  const dashboardPage = new DashboardPage(page);
  const policyPage = new PolicyPage(page);

  await dashboardPage.PolicyNavigation();
  await policyPage.WaitforLoadState();
  await policyPage.addPolicy.click();
  await page.waitForSelector("#policy-name-input");
  await policyPage.setNameAndDescription(
    policyData.createAndUpdatePolicy.name,
    policyData.createAndUpdatePolicy.description
  );

  await policyPage.addApplicationButton.click();
  await page.waitForLoadState("networkidle");
  await policyPage.checkAllCheckboxesFromJson(
    policyData.createAndUpdatePolicy.applications
  );
  await policyPage.saveButton.click();
  await page.waitForLoadState("networkidle");

  //setting toggle values to 100
  //first toggle
  await policyPage.firsttoggledOption.setChecked(
    policyData.createAndUpdatePolicy.deploymentConstraints.toggle
  );
  await policyPage.maxseats.click();
  await policyPage.maxseatsplaceholder.fill(
    policyData.createAndUpdatePolicy.deploymentConstraints.maximumSeats
  );
  await policyPage.maximumdesktops.click();
  await policyPage.maximumdesktopsplaceholder.fill(
    policyData.createAndUpdatePolicy.deploymentConstraints.maximumDesktopPerUser
  );

  //Second toggle
  await policyPage.secondtoggledOption.setChecked(
    policyData.createAndUpdatePolicy.offlineUsage.toggle
  );
  await policyPage.maxdays.click();
  await policyPage.maxdaysplaceholder.fill(
    policyData.createAndUpdatePolicy.offlineUsage.maxDays
  );

  await policyPage.savePolicyButton.click();
  await page.waitForLoadState("networkidle");
  await expect(policyPage.alertMessageDialog).toContainText(
    `${policyData.validationMessages.policyCreationSucessMessage}`
  );
  await page.waitForLoadState("networkidle");
});

test("Validate that user is able to edit the policy and save it. Now delete this policy to perform cleaning operation.", async () => {
  const dashboardPage = new DashboardPage(page);
  const policyPage = new PolicyPage(page);

  await dashboardPage.PolicyNavigation();
  await policyPage.WaitforLoadState();
  await policyPage.viewPolicy(policyData.createAndUpdatePolicy.name);
  await policyPage.editPolicy.click();
  await page.waitForLoadState("networkidle");

  await policyPage.policyDescription.fill(
    policyData.createAndUpdatePolicy.updatedDescription
  );
  await page.waitForLoadState("networkidle");
  await policyPage.maximumSeatsOnEdit.fill(
    policyData.createAndUpdatePolicy.deploymentConstraints.maximumSeatsOnEdit
  );
  await policyPage.maximumDesktopPerUserOnEdit.fill(
    policyData.createAndUpdatePolicy.deploymentConstraints
      .maximumDesktopPerUserOnEdit
  );
  await policyPage.maxDaysOnEdit.fill(
    policyData.createAndUpdatePolicy.offlineUsage.maxDaysOnEdit
  );
  await page.waitForLoadState("networkidle");
  //turning off last toggle
  await policyPage.lasttoggle.setChecked(
    policyData.createAndUpdatePolicy.pagingOptimizations.pageEntireAppset.toggle
  );
  //saving
  await policyPage.saveAfterEditButton.click();
  await policyPage.WaitforLoadState();
  await dashboardPage.PolicyNavigation();
  await policyPage.WaitforLoadState();
  await policyPage.newDeletion();
  console.log("Operation Completed");
  //await policyPage.sort()
  // await policyPage.viewPolicy(policyData.createAndUpdatePolicy.name)

  // await policyPage.viewPolicy(policyData.createAndUpdatePolicy.name)
});

//What should be the flow of Deletion in case if we split the deletion functionality ? because in current implementation we loop over all the valid data and create policies first
//and if we were to split the deletion from it then it will negate the task from Thusday which is
//We changed the deletion in a way that policy only deletes right after creating it 1 by 1
//The flow was policy 1 creation --> Policy 1 deletion --> Policy 2 Creation --> Policy 2 Deletion so on
//If valid test case fails that means no policy created and if no policy created we cannot delete it aswell
//Need more discussion and guidance on it
