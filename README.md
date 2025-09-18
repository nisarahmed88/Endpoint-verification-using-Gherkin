# Nisar-Javascript

This project is a demonstration of automated testing using **Playwright** with **Javascript** for the **Cloud-Pager** Application.

## Getting Started

### Install Dependencies
Navigate to the project root directory and run the following command to install the necessary dependencies:

```npm install```

or

```npx playwright install```


### Running the Test Cases
You can run the test cases using the following npm scripts:

* To run all test cases in the Chrome browser:

```npx playwright test --project=chromium```

* To run all the test cases in the Firefox browser:

```npx playwright test --project=firefox```

* To run all the test cases in the Safari browser:

```npx playwright test --project=webkit```

* To run all test cases in all supported browsers:

```npx playwright test```


### Project Structure
The project structure is organized as follows:

* tests: Contains all the **UI** test cases of application.
* page-objects: Contains all the page files where locators and functions are defined for **code reusability**.
* test-data: Contains data used in the test cases, following a **data-driven** approach.
* utils: Contains **utility** functions, a random string generator for workpods (useful for creating new workpod in tests).

Feel free to explore the project structure and customize it according to your requirements.

