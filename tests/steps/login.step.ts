const { Given, When, Then, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium, expect } = require("@playwright/test");
const { Page } = require("playwright");

let browser, page;
setDefaultTimeout(60 * 1000);

Before(async function () {
    browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    page = await context.newPage();
});

Given('I access the url {string} and go to the Sign in page', async function (url) {
    await page.goto(url);
    await page.getByText('Sign in').click();
});

When('I enter Username {string} and the Password {string} and submit the form', async function (email, password) {
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button').click();
});

Then('I will be able to login', async function () {
    await expect(page.locator('.sidebar')).toContainText('Popular Tags');
});

After(async function () {
    await browser.close();
});
