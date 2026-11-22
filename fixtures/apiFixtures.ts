
import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import { UserApi } from '../utils/userApi';

type ApiFixtures = { authedUserApi: UserApi };

export const test_api = base.extend<ApiFixtures>({

    authedUserApi: async ({ playwright }, use) => {

        const tokenFile = fs.readFileSync('.auth/api-token.json', 'utf-8');

        const { access_token }: { access_token: string } = JSON.parse(tokenFile);

        // Creating a new API context with authentication.
        const APIcontext = await playwright.request.newContext({
            baseURL: process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com',
            extraHTTPHeaders: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json',
            },
        });

        try {
            // Provide an authenticated UserApi instance to the test that requested authedUserApi.
            await use(new UserApi(APIcontext));

        } finally {
            await APIcontext.dispose();
        }
    },
});

// Export expect so API test files can import both from this fixture.
export { expect };
