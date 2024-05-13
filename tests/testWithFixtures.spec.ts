import {test} from '../page-objects/test-options';

test('parametarized method @regression', async ({pageManager}) => {
    await pageManager.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1');
    await pageManager.onFormLayoutPage().submitInlineFormWithEmailAndCheckbox('test', 'test@test.com', true);
});
