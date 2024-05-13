import { test, expect } from '@playwright/test';

test.beforeEach('Navigate to the application url', async ({ page }) => {
    await page.goto('/');
});

test.afterEach('Close the browser', async ({ page }) => {
    await page.close();
});


test.describe('PW-test Form Module @regression', () => {

    test.beforeEach('Click on Form', async ({ page }) => {
        await page.getByText('Forms').click();
    });

    test('example test_1', async ({ page }) => {
        await page.getByText('Form Layouts').click();
    });
    test('example test_2', async ({ page }) => {
        await page.getByText('Datepicker').click();
    });
});

test.describe('Modal & Overlays module @regression', () => {
    test.beforeEach('Click on Modal & Overlays', async ({ page }) => {
        await page.getByText('Modal & Overlays').click();
    })

    test('example test_3', async ({ page }) => {
        await page.getByText('Window').click();
    });
    test('example test_4', async ({ page }) => {
        await page.getByText('Popover').click();
    });
});
