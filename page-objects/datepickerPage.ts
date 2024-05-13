import { Page, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class DatepickerPage extends HelperBase {

    constructor(page: Page) {
        super(page);
    }

    async selectCommonDatepickerFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.locator('[placeholder="Form Picker"]');
        await calendarInputField.click();

        const dateToAssert = await this.selectdateInTheCalendar(numberOfDaysFromToday);
        await expect(calendarInputField).toHaveValue(dateToAssert);
    }

    async selectDatepickerWithRangeFromToday(startDate: number, endDate: number) {
        const calendarInputField = this.page.locator('[placeholder="Range Picker"]');
        await calendarInputField.click();
        const dateToAssertStart = await this.selectdateInTheCalendar(startDate);
        const dateToAssertEnd = await this.selectdateInTheCalendar(endDate);
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`;
        await expect(calendarInputField).toHaveValue(dateToAssert);
    }

    private async selectdateInTheCalendar(numberOfDaysFromToday: number) {

        let date = new Date();
        date.setDate(date.getDate() + numberOfDaysFromToday);
        const expectedDate = date.getDate().toString();
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' });
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });
        const expectedYear = date.getFullYear();
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        let expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        }
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).first().click();
        return dateToAssert;
    }
}