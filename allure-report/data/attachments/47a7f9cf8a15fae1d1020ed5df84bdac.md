# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >>  Password-user authenticate
- Location: tests\auth.setup.ts:59:1

# Error details

```
Error: page.goto: net::ERR_ABORTED at https://practicesoftwaretesting.com/auth/login
Call log:
  - navigating to "https://practicesoftwaretesting.com/auth/login", waiting until "load"

```

# Test source

```ts
  1  | import { test as setup, expect } from '@playwright/test'
  2  | import { dynamic_buildUser_Data, dynamic_API_UserData, UserData_intf_API, LoginResponse } from '../utils/testData';
  3  | import { helper } from '../utils/helper';
  4  | import { promises as fs } from 'node:fs';
  5  | import { UserApi } from '../utils/userApi';
  6  | 
  7  | 
  8  | const profile_AuthFile = 'auth.profil_user.json'
  9  | const password_AuthFile = 'auth.password_user.json'
  10 | const profile_cred_json = '.auth/Profile_Credentials.json'; // .auth or test-data
  11 | const password_cred_json = '.auth/Password_Credentials.json';
  12 | 
  13 | let util: helper;
  14 | let user_api: UserApi;
  15 | let request_Body_Profile;
  16 | let request_Body_Pwd;
  17 | 
  18 | // const userData = dynamic_buildUser_Data(
  19 | //     { email: 'rahul.sharma2026_0_@example.com', password: 'Rahul2026@1' })
  20 | // const userData_pwdTests = dynamic_buildUser_Data(
  21 | //     {
  22 | //         firstName: 'Tim', lastName: 'Roswell',
  23 | //         email: 'tim.roswell_2011_0_@example.com', password: 'Tim2026@1'
  24 | //     })
  25 | 
  26 | 
  27 | setup(' Profile-user authenticate', async ({ page, request }) => {
  28 |     util = new helper(page);
  29 |     user_api = new UserApi(request)
  30 |     const profile_credentials = await util.generate_Email_Pwd() // Rahul Sharma , pwd = pass
  31 | 
  32 |     await fs.mkdir('.auth', { recursive: true });       // mkdir('test-data',.....)
  33 |     await fs.writeFile(profile_cred_json, JSON.stringify(profile_credentials, null, 2), 'utf-8')
  34 | 
  35 |     const userData: UserData_intf_API = dynamic_API_UserData({     // register throhj API
  36 |         email: profile_credentials.email,
  37 |         password: profile_credentials.password
  38 |     })
  39 |     request_Body_Profile = await user_api.createUser(userData)
  40 | 
  41 |     // const userData = dynamic_buildUser_Data({    // register through UI, visual
  42 |     //     email: profile_credentials.email,
  43 |     //     password: profile_credentials.password
  44 |     // })
  45 |     // await util.re_register(page, userData)
  46 | 
  47 |     // const token = await user_api.loginUser_getToken(userData)    // token from API
  48 |     // console.log('token = ', token);
  49 | 
  50 |     await page.goto('/auth/login')
  51 |     await page.getByLabel('Email address *').fill(userData.email)
  52 |     await page.getByPlaceholder('Your password').fill(userData.password)
  53 |     await page.locator('.btnSubmit').click()
  54 |     await expect(page).toHaveURL(/\/account/)
  55 |     //    console.log('1 st -> Profile  Login StorageState Setup is completed');
  56 | 
  57 |     await page.context().storageState({ path: profile_AuthFile })
  58 | })
  59 | setup(' Password-user authenticate', async ({ page, request }) => {
  60 | 
  61 |     util = new helper(page);
  62 |     user_api = new UserApi(request)
  63 |     const pwd_credentials = await util.generate_Email_Pwd()
  64 | 
  65 |     await fs.mkdir('test-data', { recursive: true });
  66 |     await fs.writeFile(password_cred_json, JSON.stringify(pwd_credentials, null, 2), 'utf-8')
  67 | 
  68 |     const userData_pwdTests = dynamic_API_UserData({
  69 |         email: pwd_credentials.email,
  70 |         password: pwd_credentials.password
  71 |     })
  72 |     request_Body_Pwd = await user_api.createUser(userData_pwdTests)
  73 | 
> 74 |     await page.goto('/auth/login')
     |                ^ Error: page.goto: net::ERR_ABORTED at https://practicesoftwaretesting.com/auth/login
  75 |     await page.getByLabel('Email address *').fill(userData_pwdTests.email)
  76 |     await page.getByPlaceholder('Your password').fill(userData_pwdTests.password)
  77 |     await page.locator('.btnSubmit').click()
  78 |     await expect(page).toHaveURL(/\/account/)
  79 |     //    console.log('2 nd -> Password  Login StorageState Setup is completed ');
  80 | 
  81 |     await page.context().storageState({ path: password_AuthFile })
  82 | 
  83 | })
  84 | 
```