import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();

export default defineConfig({

    use: {
        baseURL: 'http://localhost:4200/',
    },

    projects: [
        {
            name: 'chromium',
        },
    ]
});
