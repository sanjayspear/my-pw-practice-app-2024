import { Page } from '@playwright/test';
import { HelperBase } from './helperBase';

export class NavigationPage extends HelperBase {

    constructor(page: Page) {
        super(page);
    }

    async formLayoutPage() {
        await this.selectGroupMenuItem('Form');
        await this.page.getByText('Form Layouts').click();
        await this.waitForNumberOfSeconds(2);
    }

    async datePickerPage(){
        await this.selectGroupMenuItem('Form');
        await this.page.getByText('Datepicker').click(); 
    }

    async smartTablePage(){
        await this.selectGroupMenuItem('Tables & Data');
        await this.page.getByText('Smart Table').click();
    }

    async toastPage(){
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.page.getByText('Toastr').click();
    }

    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays');
        await this.page.getByText('Tooltip').click();
    }

    private async selectGroupMenuItem(groupMenuTitle: string){
        const groupMenuItem = this.page.getByTitle(groupMenuTitle).first();
        const expandedState = await groupMenuItem.getAttribute('aria-expanded');
        if(expandedState == "false")
            await groupMenuItem.click();
    }
}