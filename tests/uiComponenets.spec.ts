// Import Playwright test functions
import { test, expect } from '@playwright/test';
import { table } from 'console';
import { timeout } from 'rxjs-compat/operator/timeout';

// Run this code before each test in the suite: Navigate to a base URL
test.beforeEach('Navigate to the base url', async ({ page }) => {
    // Navigate the browser to the specified URL
    await page.goto('/');
});

// Run this code after each test in the suite: Close the browser to clean up
test.afterEach('Close the browser', async ({ page }) => {
    // Close the current browser page
    await page.close();
});

// Group tests related to the 'Form Layout Page'
test.describe('Form Layout Page @regression', () => {
    test.describe.configure({retries: 0})
    // Run this before each test in the 'Form Layout Page' group: Navigate to the specific section
    test.beforeEach(async ({ page }) => {
        // Click on the 'Forms' text to navigate
        await page.getByText('Forms').click();
        // Click on 'Form Layouts' to enter that section
        await page.getByText('Form Layouts').click();
        // Additional click to ensure navigation - might be redundant and can be removed if not needed
        await page.getByText('Form Layouts').click();
    });

    // Define a specific test for 'Input Fields' under 'Form Layout Page'
    test('Input Fields', async ({ page }, testInfo) => {
        if(testInfo.retry){
            //pre-condition setup before retry
        }
        // Locate the email input inside a card with specific text and fill it with an email
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" });
        await usingTheGridEmailInput.fill('test@test.com'); // Fill the input with text
        await page.waitForTimeout(5000); // Wait for 5 seconds (likely for some UI updates to occur)
        await usingTheGridEmailInput.clear(); // Clear the previously filled text
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 }); // Type a new email with a delay between key presses

        // Assert the input field's value using a generic method
        const userInputValue = await usingTheGridEmailInput.inputValue();
        expect(userInputValue).toEqual('test2@test.com');

        // Assert the input field's value using Playwright's expect to handle assertions directly related to locators
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    });

    test('radio buttons', async ({ page }) => {
        const usingTheGridCard = page.locator('nb-card', { hasText: "Using the Grid" });
        /**
        * Inside the check() function, the {force: true} argument is passed because the radio button is naturally hidden.
        * This forces the selection or checking of the radio button. If the radio button were not hidden,
        * a simple call to the check() function would be sufficient without passing any argument explicitly to the
        * check() function call.
        */

        //*********To check Option 1 from the `Using the Grid` card**********
        await page.waitForTimeout(2000);
        //Here we located the radio button using the getByRole() function call
        await usingTheGridCard.getByRole('radio', { name: "Option 1" }).check({ force: true });

        //alternatively you can also locate radio button using the getByLabel() fuction call
        //await usingTheGridCard.getByLabel('Option 1').check({ force: true });

        //Verify whether the radio button has been successfully selected or not (Generic Assertion)
        const radioStatus = await usingTheGridCard.getByRole('radio', { name: "Option 1" }).isChecked();

        //Generic assertion approach
        expect(radioStatus).toBeTruthy();


        //****To check Option 2 from the `Using the Grid` card make sure Option 1 is auto unchecked upon checking Option 1 *****
        await usingTheGridCard.getByLabel('Option 2').check({ force: true });

        //Verify whether the radio button has been successfully selected or not (Using Locator Assertion)
        await expect(usingTheGridCard.getByLabel('Option 2')).toBeChecked();

        //Verify whether the radio button (Option 1) has been successfully dis-selected or not (Using Generic Assertion);
        expect(await usingTheGridCard.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy();

        //Verify whether the radio button (Option 2) has been successfully dis-selected or not (Using Generic Assertion);
        expect(await usingTheGridCard.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy();
    });

    //Here, we use visual testing approach Instead of normal way of assertion to check radio button selection
    test('Visual Testing', async ({ page }) => {
        const usingTheGridCard = page.locator('nb-card', { hasText: "Using the Grid" });
        await usingTheGridCard.getByRole('radio', { name: "Option 1" }).check({ force: true });
        //This method will generate a baseline as a golden screenshot for the future snapshot comparision
        await expect(usingTheGridCard).toHaveScreenshot();
    });
});

test('Checkboxes @smoke', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();
    await page.waitForTimeout(2000);
    await page.getByRole('checkbox', { name: "Hide on click" }).uncheck({ force: true });
    await page.waitForTimeout(2000);
    await page.getByRole('checkbox', { name: "Hide on click" }).check({ force: true });
    await page.waitForTimeout(2000);
    await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast" }).check({ force: true });
    await page.waitForTimeout(2000);
});

test('To Select all Checkboxes @smoke', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();
    await page.waitForTimeout(3000);

    //No need to mention name of the checkbox, because we want select all checkboxes
    const allCheckBoxes = page.getByRole('checkbox');

    //here, all() method converts allCheckBoxes varible to array
    for (const box of await allCheckBoxes.all()) {
        await box.check({ force: true });
        await page.waitForTimeout(1000);
        expect(await box.isChecked()).toBeTruthy();
    }

});

test('To Un Select all Checkboxes @smoke', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();
    await page.waitForTimeout(3000);

    //No need to mention name of the checkbox, because we want un select all checkboxes
    const allCheckBoxes = page.getByRole('checkbox');

    //here, all() method converts allCheckBoxes varible to array
    for (const box of await allCheckBoxes.all()) {
        await box.uncheck({ force: true });
        await page.waitForTimeout(1000);
        expect(await box.isChecked()).toBeFalsy();
    }
});

test('Dropdown and List @regression', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    await dropdownMenu.click();

    page.getByRole('list'); // when list has UL tag
    page.getByRole('listitem'); //when list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);
    await optionList.filter({ hasText: 'Cosmic' }).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };

    await dropdownMenu.click();
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if (color != "Corporate")
            await dropdownMenu.click();
    }
});


test('Validate background color for "Cosmic"', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    await dropdownMenu.click();

    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);
    await optionList.filter({ hasText: 'Cosmic' }).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');
});

test('Validate background colors for all options', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    const header = page.locator('nb-layout-header');
    const optionList = page.locator('nb-option-list nb-option');
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };

    await dropdownMenu.click();
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);

    for (const color in colors) {
        await optionList.filter({ hasText: color }).click();
        await expect(header).toHaveCSS('background-color', colors[color]);

        // Ensure the dropdown is closed and reopened between selections
        if (color != "Corporate")
            await dropdownMenu.click();
    }
});

test('Tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const toolTipCard = page.locator('nb-card', { hasText: "Tooltip Placements" });
    await toolTipCard.getByRole('button', { name: "TOP" }).hover();

    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
});

test('Dialogue Box', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // Set up the dialog listener before the action that triggers the dialog
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept();
    });

    // Action that triggers the dialog
    await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click();

    // Assertions after the dialog has been handled
    await expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com");
});

test('Web Table', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    const targetRow = page.getByRole('row', { name: 'mdo@gmail.com' });
    await targetRow.locator('.nb-edit').click();
    await page.waitForTimeout(1000);
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill("36");
    await page.waitForTimeout(1000);
    await page.locator('.nb-checkmark').click();
    await page.waitForTimeout(1000);
});

test('Web Table Two', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    await page.waitForTimeout(3000);
    const targetRowById = page.getByRole('row', { name: '11' }).filter({ has: page.locator('td').nth(1).getByText('11') });
    await targetRowById.locator('.nb-edit').click();
    await page.waitForTimeout(1000);
    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
    await page.locator('input-editor').getByPlaceholder('E-mail').fill("sanjay050592@gmail.com");
    await page.waitForTimeout(1000);
    await page.locator('.nb-checkmark').click();
    await page.waitForTimeout(1000);
    await expect(targetRowById.locator('td').nth(5)).toHaveText('sanjay050592@gmail.com');
});

test('Web Table Three', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    const ages = ["20", "30", "40", "200"];

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500);
        const ageRows = page.locator('tbody tr');

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent();

            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found');
            } else {
                expect(cellValue).toEqual(age);
            }
        }
    }
});

test('Date Picker Test', async ({ page }) => {
    // Navigate to the Forms section
    await page.getByText('Forms').click();  

    // Open the Datepicker page
    await page.getByText('Datepicker').click();  

    // Define the calendar input field for later use
    const calendarInputField = page.getByPlaceholder('Form Picker');  

    // Open the date picker dialog by clicking the input field
    await calendarInputField.click();  

    // Select the first day of the month ensuring exact text match
    // The 'exact: true' option ensures that only elements with exactly "1" are clicked.
    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click();  

    // Verify that the calendar input field now contains the correct date
    await expect(calendarInputField).toHaveValue('May 1, 2024');
});

// Define and initiate the test with the test ID 'Date Picker Test 002'
test('Date Picker Test 002', async ({ page }) => {
    // Navigate to the 'Forms' section on the page
    await page.getByText('Forms').click();
    // Within 'Forms', go to the 'Datepicker' section
    await page.getByText('Datepicker').click();

    // Locate the input field for the date picker using its placeholder text
    const calendarInputField = page.getByPlaceholder('Form Picker');
    // Open the date picker dialogue by clicking the input field
    await calendarInputField.click();

    // Set the date to a week from today
    let date = new Date();
    date.setDate(date.getDate() + 7);
    // Prepare the date, month (short form), month (long form), and year for assertions
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'});
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'});
    const expectedYear = date.getFullYear();
    // Format the date as it should appear in the input field after selection
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    // Fetch the currently displayed month and year from the calendar
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    let expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;
    // Navigate the calendar months until the expected month and year are visible
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    // Select the day from the calendar that matches 'expectedDate'
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();  
    // Assert that the date in the input field matches the expected date
    await expect(calendarInputField).toHaveValue(dateToAssert);
    // Wait for 2 seconds to observe the selected date in the date picker
    await page.waitForTimeout(2000);
});

test('Slider Test', async ({page}) => {
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
    tempGauge.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '235.654');
        node.setAttribute('cy', '226.068');
    });
    await tempGauge.click();
    await page.waitForTimeout(1000);
});

// Define the test case for Playwright to execute
test('Slider Test Approach 2', async ({ page }) => {
    // Select the element for the temperature slider by its title and custom element tag
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');

    // Pause execution for 1000 milliseconds to ensure elements are loaded and stable
    await page.waitForTimeout(1000);

    // Ensure the element is visible on the screen by scrolling to it if needed
    await tempBox.scrollIntoViewIfNeeded();

    // Get the bounding box of the slider, which includes its position and dimensions
    const box = await tempBox.boundingBox();

    // Calculate the center point of the slider element to start the mouse interaction
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    // Move the mouse cursor to the calculated center of the slider
    await page.mouse.move(x, y);

    // Press the mouse button down to initiate the drag action
    await page.mouse.down();

    // Drag the slider horizontally by 100 pixels to the right
    await page.mouse.move(x + 100, y);

    // Drag the slider vertically by 100 pixels downward (optional step for demonstration)
    await page.mouse.move(x + 100, y + 100);

    // Release the mouse button to drop the slider at the new position
    await page.mouse.up();

    // Wait again to ensure the UI has updated following the interaction
    await page.waitForTimeout(1000);

    // Assert that the text within the slider element now contains '30'
    // This checks if the slider's value or label reflects the expected value after the move
    await expect(tempBox).toContainText('30');
});







