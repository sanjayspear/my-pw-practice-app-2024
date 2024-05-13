import { test, expect } from '@playwright/test';
import { timeout } from 'rxjs-compat/operator/timeout';

test.beforeEach('Navigate to application url', async ({ page }) => {
    await page.goto(process.env.URL);    
    //await page.getByRole('button', {name: "Button Triggering AJAX Request"}).click();
    await page.getByText('Button Triggering AJAX Request').click();
});

test('autowaiting for text content @smoke', async ({page}) => {
    //const text = await page.getByText('Data loaded with AJAX get request.').textContent();
    const text = await page.locator('.bg-success').textContent();
    expect(text).toEqual('Data loaded with AJAX get request.');
});

test('try autowaiting for allTextContents @regression', async ({page}) => {
   //Note by default allTextContent() do not auto wait
    const text = page.locator('.bg-success');
    //await text.waitFor({state: "attached"});
    //const successMsg = await text.allTextContents();
    await expect(text).toHaveText('Data loaded with AJAX get request.', {timeout: 20000});
});

test('alternative wait 1 @smoke', async ({ page }) => {
    //---Wait for element
    await page.waitForSelector('.bg-success');

    const successButton = page.locator('.bg-success');
    expect(successButton).toHaveText('Data loaded with AJAX get request.');
});

test('alternative wait 2 @regression', async ({ page }) => {
    //---Wait for response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

    const successButton = page.locator('.bg-success');
    expect(successButton).toHaveText('Data loaded with AJAX get request.');
});

test('alternative wait 3 @smoke', async ({ page }) => {
    //---Wait for network calls to be completed (Not Recommended)
    await page.waitForLoadState('networkidle');

    const successButton = page.locator('.bg-success');
    expect(successButton).toHaveText('Data loaded with AJAX get request.');
});

test('alternative wait 4 @regression', async ({ page }) => {
    //---Wait for timeout (static timeout): NOt Recommended
    await page.waitForTimeout(15000);

    const successButton = page.locator('.bg-success');
    expect(successButton).toHaveText('Data loaded with AJAX get request.');
});