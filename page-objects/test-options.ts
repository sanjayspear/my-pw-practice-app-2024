// Import the `test` function from '@playwright/test' package and rename it to `base`
import {test as base} from '@playwright/test';
// Import the PageManager class from the local 'pageManager' file
import { PageManager } from './pageManager';

// Define a TypeScript type for options that will be used in the extended test context
export type TestOptions = {
    formLayoutsPage: string;
    pageManager: PageManager;
}

// Extend the Playwright `test` function with custom test options
export const test = base.extend<TestOptions>({
    // Define a custom fixture to navigate to the 'Form Layouts' page
    formLayoutsPage: async({page}, use) => {
        await page.goto('/'); // Navigate to the homepage
        await page.getByText('Forms').click(); // Click on the 'Forms' link
        await page.getByText('Form Layouts').click(); // Click on the 'Form Layouts' link
        await use(''); // Use an empty string as the value for this fixture
        console.log('Tear Down'); // Log 'Tear Down' when the test is done with this fixture
        await page.close(); // Close the page when done
    },

    // Define a custom fixture to provide a PageManager instance
    pageManager: async ({page, formLayoutsPage}, use) => {
        const pm = new PageManager(page) // Instantiate PageManager with the current page
        await use(pm) // Pass the PageManager instance to the test
    }
});
