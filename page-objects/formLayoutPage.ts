import { Page } from '@playwright/test';
import { HelperBase } from './helperBase';

export class FormLayoutPage extends HelperBase {

    constructor(page: Page) {
        super(page);
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', { hasText: "Using the Grid" });
        await usingTheGridForm.getByRole('textbox', { name: "Email" }).fill(email);
        await usingTheGridForm.getByRole('textbox', { name: "Password" }).fill(password);
        await usingTheGridForm.getByRole('radio', { name: optionText }).check({ force: true });
        await usingTheGridForm.getByRole('button').click();
    }

    /**
     * 
     * @param name : should be the first and the last name
     * @param email : valid email for the test user
     * @param rememberMe true or false if user session to be safed
     */
    async submitInlineFormWithEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
        const usingInlineForm = this.page.locator('nb-card', { hasText: "Inline form" });
        await usingInlineForm.getByRole('textbox', { name: "Jane Doe" }).fill(name);
        await usingInlineForm.getByRole('textbox', { name: "Email" }).fill(email);
        if (rememberMe)
            await usingInlineForm.getByRole('checkbox').check({ force: true });
        await usingInlineForm.getByRole('button').click();
    }
}