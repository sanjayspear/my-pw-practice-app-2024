import {test, expect} from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import {faker} from '@faker-js/faker';

test.beforeEach('Navigate to the base url', async ({ page }) => {
    await page.goto('/');
});

test('navigate to form page @regression', async ({page}) => {
    const pm = new PageManager(page);
    await pm.navigateTo().formLayoutPage();
    await pm.navigateTo().datePickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastPage();
    await pm.navigateTo().tooltipPage();
});

test('parametarized method @regression', async ({page}) => {
    const pm = new PageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(100)}@test.com`;

    await pm.navigateTo().formLayoutPage();
    await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1');
    await page.screenshot({path: 'screenshots/formlayoutsPage.png'});
    const buffer = await page.screenshot();
    console.log(buffer.toString('base64'));
    
    await pm.onFormLayoutPage().submitInlineFormWithEmailAndCheckbox(randomFullName, randomEmail, true);
    await page.locator('nb-card', { hasText: "Inline form" }).screenshot({path: 'screenshots/inlineForm.png'});

    await page.waitForTimeout(6000);

    await pm.navigateTo().datePickerPage();
    await pm.onDatepickerPage().selectCommonDatepickerFromToday(8);
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(15, 25);
});
