import { test, expect } from '@playwright/test';

// Define and initiate the drag and drop test within an iFrame
test('Drag and Drop test with iFrame @regression', async ({ page }) => {
    // Navigate to the specified URL where the test will be performed
    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/');

    // Access the iframe that contains the draggable items and drop area
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')

    // Perform a simple drag and drop operation from the list item 'High Tatras 2' to the 'trash' drop area
    await frame.locator('li', { hasText: 'High Tatras 2' }).dragTo(frame.locator('#trash'));

    // Begin a more controlled drag and drop for 'High Tatras 4'
    // Hover over the 'High Tatras 4' list item to start the drag operation
    await frame.locator('li', { hasText: 'High Tatras 4' }).hover();
    // Simulate holding down the mouse button to start dragging
    await page.mouse.down();
    // Hover over the 'trash' drop area while holding the dragged item
    await frame.locator('#trash').hover();
    // Release the mouse button to drop the item in the trash
    await page.mouse.up();

    // Assert that both items 'High Tatras 2' and 'High Tatras 4' are now in the trash
    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2', 'High Tatras 4']);
});
