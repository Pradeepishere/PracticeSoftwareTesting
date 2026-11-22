import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  timeout: 100 * 1000,
  expect: { timeout: 8 * 1000 },

  /* Run tests in files in parallel */
  fullyParallel: true,
  // workers: 3,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 1,  // undefined,
  /* Opt out of parallel tests on CI. */

  // workers: process.env.CI ? 1 : undefined,
  workers: process.env.CI ? 3 : 2,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['allure-playwright', {
      resultsDir: 'allure-results'
    }]
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,

    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',         // 'on-first-retry',
    screenshot: 'only-on-failure',

    ...devices['Desktop Chrome'],
    headless: true,

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,    //   /.*\.setup\.ts/
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,

        storageState: 'auth.profil_user.json',
      },
    },


    //   {
    //   name: 'setup',
    //   testMatch: '**/*.setup.ts',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: {
    //       cookies: [],
    //       origins: [],
    //     },
    //   },
    // },

    // {
    //   name: 'chromium',
    //   dependencies: ['setup'],
    //   testMatch: '**/*.spec.ts',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     headless: false,
    //     storageState: 'auth.profil_user.json',
    //   },
    // },

    // {',,,
    //   name: 'api',    // for api tests only
    //   dependencies: ['setup'],
    //   testMatch: /.*\.api\.spec\.ts/,
    //   use: {         // name your API test files with the .api.spec.ts suffix:
    //     ...devices['Desktop Chrome'],   // tests/User.api.spec.ts  or Profile.api.spec.ts
    //   },
    // },


    // 1. Authentication setup
    // {
    //   name: 'setup',
    //   testMatch: /auth\.setup\.ts$/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     headless: false,
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },
    // // comment dependencies , if we want to run testFile without sequence

    // // 2. Register
    // {
    //   name: 'register',
    //   testMatch: '**/Register.spec.ts',
    //   dependencies: ['setup'],
    //   use: {
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },

    // // 3. Login
    // {
    //   name: 'login',
    //   testMatch: '**/Login.spec.ts',
    //   dependencies: ['register'],
    //   use: {
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },

    // // 4. Forgot Password
    // {
    //   name: 'forgotPassword',
    //   testMatch: '**/Forgot_Password.spec.ts',
    //   dependencies: ['login'],
    //   use: {
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },

    // // 5. Profile
    // {
    //   name: 'profile',
    //   testMatch: '**/Profile.spec.ts',
    //   //dependencies: ['setup'],
    //   dependencies: ['forgotPassword'],
    //   use: {
    //     storageState: 'auth.profil_user.json',
    //   },
    // },
    // {
    //   name: 'practice',
    //   testMatch: '**/practice.spec.ts',
    //   //dependencies: ['setup'],
    //   //dependencies: ['forgotPassword'],
    //   use: {
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },




    // {
    //   name: 'setup',
    //   testMatch: /auth\.setup\.ts/,    //   /.*\.setup\.ts/
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },

    // {
    //   name: 'chromium',
    //   dependencies: ['setup'],
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     headless: false,

    //     storageState: 'auth.profil_user.json',
    //   },
    //  },



    // _________________________________
    //     {
    //       name: 'chromium',
    //       use: {
    //         ...devices['Desktop Chrome'],
    //         headless: false,
    //       },
    //     },
    // __________________________________

    // A. SEQUENTIAL WORKFLOW
    // ==========================================

    // {
    //   name: 'setup',
    //   testMatch: /auth\.setup\.ts$/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     headless: false,
    //     storageState: {
    //       cookies: [], origins: [],
    //     },
    //   },
    // },

    // {
    //   name: 'sequence-register',
    //   testMatch: '**/Register.spec.ts',
    //   dependencies: ['setup'],
    //   use: {
    //     storageState: {
    //       cookies: [], origins: [],
    //     },
    //   },
    // },

    // {
    //   name: 'sequence-login',
    //   testMatch: '**/Login.spec.ts',
    //   dependencies: ['sequence-register'],
    //   use: {
    //     storageState: {
    //       cookies: [], origins: [],
    //     },
    //   },
    // },

    // {
    //   name: 'sequence-forgotPassword',
    //   testMatch: '**/Forgot_Password.spec.ts',
    //   dependencies: ['sequence-login'],
    //   use: {
    //     storageState: {
    //       cookies: [], origins: [],
    //     },
    //   },
    // },

    // {
    //   name: 'sequence-profile',
    //   testMatch: '**/Profile.spec.ts',
    //   dependencies: ['sequence-forgotPassword'],
    //   use: {
    //     storageState: 'auth.profil_user.json',
    //   },
    // },

    // ==========================================
    // B. INDEPENDENT / PARALLEL EXECUTION
    // ==========================================



    // 1. Authentication setup
    //     {
    //         name: 'setup',
    //         testMatch: /auth\.setup\.ts$/,
    //         use: {
    //             ...devices['Desktop Chrome'],
    //             storageState: {
    //                 cookies: [],
    //                 origins: [],
    //             },
    //         },
    //     },

    //     // 2. Existing Chromium project
    //     {
    //         name: 'chromium',
    //         use: {
    //             ...devices['Desktop Chrome'],
    //             headless: false,
    //             storageState: 'auth.profil_user.json',
    //         },
    //         dependencies: ['setup'],
    //     },

    //     // 3. Run any selected spec file AFTER setup
    //     {
    //         name: 'setup-before-any-spec',
    //         testMatch: '**/*.spec.ts',
    //         dependencies: ['setup'],
    //         use: {
    //             ...devices['Desktop Chrome'],
    //             headless: false,
    //             storageState: 'auth.profil_user.json',
    //         },
    //     },
    // ],



    // name: 'independent',
    // testMatch: '**/*.spec.ts',
    // //testIgnore: '**/*.setup.ts',
    // fullyParallel: true,
    // use: {
    //   ...devices['Desktop Chrome'],
    //   headless: false,
    //   storageState: {
    //     cookies: [], origins: [],
    //   },
    // },
    // },

    //  ( 4 )
    // 1. Authentication setup
    // {
    //   name: 'setup',
    //   testMatch: /auth\.setup\.ts$/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     headless: false,
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },
    // // comment dependencies , if we want to run testFile without sequence

    // // 2. Register
    // {
    //   name: 'register',
    //   testMatch: '**/Register.spec.ts',
    //   // dependencies: ['setup'],
    //   use: {
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },

    // // 3. Login
    // {
    //   name: 'login',
    //   testMatch: '**/Login.spec.ts',
    //   //  dependencies: ['register'],
    //   use: {
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },

    // // 4. Forgot Password
    // {
    //   name: 'forgotPassword',
    //   testMatch: '**/Forgot_Password.spec.ts',
    //   //  dependencies: ['login'],
    //   use: {
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },

    // // 5. Profile
    // {
    //   name: 'profile',
    //   testMatch: '**/Profile.spec.ts',
    //   dependencies: ['setup'],
    //   // dependencies: ['forgotPassword'],
    //   use: {
    //     storageState: 'auth.profil_user.json',
    //   },
    // },

    //  ( 1 )
    // {
    //   name: 'chromium',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     headless: false,
    //   },
    // },

    //  ( 2 )
    // {
    //   name: 'setup',
    //   testMatch: /auth\.setup\.ts/,    //   /.*\.setup\.ts/
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: { cookies: [], origins: [] },
    //   },
    // },
    // {
    //   name: 'chromium',
    //   // testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     headless: false,

    //     storageState: 'auth.profil_user.json',
    //   },
    //   dependencies: ['setup'],
    // },


    //  ( 3 )
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
