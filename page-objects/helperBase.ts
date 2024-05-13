import { Page, expect } from '@playwright/test';

export class HelperBase {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForNumberOfSeconds(timeInSeconds: number) {
        await this.page.waitForTimeout(timeInSeconds * 1000);
    }
    //Element State Check Methods
    async isVisible(selector: string) {
        return await this.page.locator(selector).isVisible();
    }

    async isHidden(selector: string) {
        return await this.page.locator(selector).isHidden();
    }

    //  Safe Click and Input Methods
    async safeClick(selector: string) {
        await this.page.locator(selector).waitFor({ state: 'visible' });
        await this.page.locator(selector).click();
    }

    //Navigation Helpers
    async goTo(url: string) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    async reloadPage() {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
    }

    //Utility Functions for Screenshots or Logs
    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }

    async logCurrentUrl() {
        console.log('Current URL:', await this.page.url());
    }

    // Assertions and Verifications 
    async expectText(selector: string, expectedText: string) {
        await expect(this.page.locator(selector)).toHaveText(expectedText);
    }

    async expectCount(selector: string, count: number) {
        await expect(this.page.locator(selector)).toHaveCount(count);
    }

    // Handling Alerts, or Popups
    async acceptAlert() {
        await this.page.on('dialog', dialog => dialog.accept());
    }

    //Scrolling Helpers
    async scrollToElement(selector: string) {
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }

}