import { test, expect } from '@playwright/test';

//test.setTimeout(120000);
test.beforeEach('Navigate to application url', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').waitFor({ state: 'visible' });
    await page.getByText('Form Layouts').click();
});

test.afterEach('Close the browser', async ({ page }) => {
    await page.close();
});

test('Locator syntax rules @regression', async ({ page }) => {
    //By Tag Name
    //await page.locator('input').first().click();

    //By ID
    //await page.locator('#inputEmail1').click();

    //By Class Value
    page.locator('.shape-rectangle');

    //By attribute
    page.locator('[placeholder="Email"]');

    //By Class Value (Full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

    //By Combine Different Selectors
    page.locator('input[placeholder="Email"]inputEmail1shape-rectangle[nbinput]');

    //By Xpath (Not Recommended)
    page.locator('//*[@id="inputEmail1"');

    //By partial text match
    page.locator(':text("Using")');

    //By exact text match
    page.locator(':text-is("Using the Grid")');
});

test('User facing locators @regression', async ({ page }) => {
    await page.getByRole('textbox', { name: "Email" }).first().fill('sanjay@gmail.com');
    await page.getByLabel('Email').first().waitFor({ state: 'visible' });
    await page.getByLabel('Email').first().fill('sagar@gmail.com');
    await page.getByPlaceholder('Jane Doe').fill('Sanjay');
    await page.getByText('Using the Grid').click();
    await page.getByRole('button', { name: "SIGN IN" }).first().click();
    await page.getByTestId('SignIn').click();
    await page.getByTitle('IoT Dashboard').click();
});

test('Locating child element @regression', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    //alternatively you can also do by chaning the locators
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

    //Combination of both CSS selector and user-facing locator
    await page.locator('nb-card').getByRole('button', { name: "SIGN IN" }).first().click();

    //Using index of the web element (Not Recommended)
    await page.locator('nb-card').nth(3).getByRole('button').click();
});

test('Locating parent element @regression', async ({ page }) => {
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole("textbox", { name: "Email" }).click();
    await page.locator('nb-card', { has: page.locator("#inputEmail1") }).getByRole("textbox", { name: "Email" }).click();
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole("textbox", { name: "Email" }).click();
    await page.locator('nb-card').filter({ has: page.locator(".status-danger") }).getByRole("textbox", { name: "Password" }).click();
    await page.locator('nb-card').filter({ has: page.locator("nb-checkbox") }).filter({ hasText: "SIGN IN" })
        .getByRole("textbox", { name: "Password" }).click();

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole("textbox", { name: "Email" }).click();
});

test('Reusing the locators @regression', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
    const email = basicForm.getByRole("textbox", { name: "Email" });
    const password = basicForm.getByRole("textbox", { name: "Password" });
    const submitBtn = basicForm.getByRole("button", { name: "Submit" });

    await email.fill('test@test.com');
    await password.fill('1234');
    await submitBtn.click();

    await expect(email).toHaveValue('test@test.com');
});

test('Extracting values from DOM elements @smoke', async ({ page }) => {
    //To get single text value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
    const buttonText = await basicForm.locator('button').textContent();
    expect(buttonText).toEqual('Submit');

    //To get all text values
    const getAllRadioBtn = await page.locator('nb-radio').allTextContents();
    expect(getAllRadioBtn).toContain("Option 1");

    //To get user input value
    const emailField = basicForm.getByRole('textbox', { name: "Email" });
    await emailField.fill("test@test.com");
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual("test@test.com");

    //to get attribute values from html DOM
    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email');

    const typeValue = await emailField.getAttribute('type');
    expect(typeValue).toEqual('email');

    const idValue = await emailField.getAttribute('id');
    expect(idValue).toEqual('exampleInputEmail1');
});

test('Assertions @regression', async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button');
    
    //General assertion
    const value = 5;
    expect(value).toEqual(5);

    const text = await basicFormButton.textContent();
    expect(text).toEqual('Submit');

    //Locator Assertion
    await expect(basicFormButton).toHaveText('Submit');

    //Soft Assertion (Not recommended)
    await expect.soft(basicFormButton).toHaveText('SUBMIT');
    await basicFormButton.click();
});