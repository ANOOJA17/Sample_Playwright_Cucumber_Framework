const { Given, When, Then, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium, expect, request } = require("@playwright/test");
const { Page } = require("playwright");
const fs  = require('fs');

let browser, page, data;
setDefaultTimeout(60 * 1000);


Before(async function () {
    browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    page = await context.newPage();
});

Given('I import {string} file', async function (filename) {
    const jsonString = fs.readFileSync(`../Sample_Playwright_Cucumber_Framework/test-data/${filename}`, 'utf-8');
    data = JSON.parse(jsonString);
});

When('I mock {string} api response', async function (apiURL) {
    //Mock API response
    await page.route(apiURL, async route => {
        await route.fulfill({
            body: JSON.stringify(data)
        });
    });
});

When('I modify {string} api response', async function (apiURL) {
    //Modify API response
    await page.route(apiURL, async route => {
        const res = await route.fetch();
        const resbody = await res.json();
        resbody.articles[0].title = 'This is a new article';
        resbody.articles[0].description = 'This is a new description';
        await route.fulfill({
            body: JSON.stringify(resbody)
        });
    });
});

Then('I navigate to the {string} website', async function (baseURL) {
    await page.goto(baseURL);
});

Then('I will be able to see the mocked values in the website', async function () {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('.sidebar')).toContainText('API');
    await expect(page.locator('.sidebar')).toContainText('Automation');
    await expect(page.locator('.sidebar')).toContainText('Playwright');
    await expect(page.locator('.sidebar')).toContainText('Testing'); 
    await expect(page.locator('.article-preview').first()).not.toContainText('Loading articles...');
    await expect(page.locator('.article-preview h1').first()).toContainText('This is a new article');
    await expect(page.locator('.article-preview p').first()).toContainText('This is a new description');
});

Given('I login to {string} and Sign in with username: {string} and password: {string}', async function (url, email, password) {
    await page.goto(url);
    await page.getByText('Sign in').click();
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button').click();
});

When('I post a new article through {string} API', async function (articleURL) {
    const loginresponse = await page.request.post("https://conduit-api.bondaracademy.com/api/users/login", {
        data: {
            "user" : {"email": "ask123@test.com", "password": "ask123"}
        }
    });
    const responsebody = await loginresponse.json();
    const auth = responsebody.user.token;
    const articleresponse = await page.request.post(articleURL, {
        data: {
            "article" : {"title": "Test article", "description": "Test description", "body": "Test body", "tagList": ["Playwright"]}
        },
        headers: {
            Authorization: `Token ${auth}`
        }
    });
    expect(articleresponse.status()).toEqual(201);
});

Then('I will be able to delete the new article in the website', async function () {
    await page.getByText('Global Feed').click();
    await page.getByText('Test article').click();
    await page.getByRole('button', {name: 'Delete Article'}).first().click();
    await page.getByText('Global Feed').click();
    await expect(page.locator('.article-preview').first()).not.toContainText('Loading articles...');
    await expect(page.locator('.article-preview').first()).not.toContainText('Test article');
});

After(async function () {
    await browser.close();
});
