import { test, expect, Page, request, APIRequestContext } from '@playwright/test';
import { dynamic_API_UserData, dynamic_buildUser_Data, uniqueEmail, validRegistration_Data } from '../utils/testData';
import { PageObjectManager } from '../pages/PageObjectManager';
import { UserApi } from '../utils/userApi';

test.describe('Forgot Password Page', () => {

    test.use({              // remove storage state for this  test File
        storageState: { cookies: [], origins: [] },
    });              // Start without an authenticated session

    // let context: BrowserContext;
    let page: Page;
    let pom: PageObjectManager;     // contains all Page Objects, call through this pom
    let apiContext: APIRequestContext;

    const user_email = uniqueEmail()
    const userdata = dynamic_API_UserData({ email: user_email });

    // test.beforeAll(async ({ browser }) => {
    //     apiContext = await request.newContext()
    //     //  try {       // Register the user only once before this describe block's tests through API
    //     await new UserApi(apiContext).createUser(userdata)
    //     //  }
    //     //   finally {
    //     //       await apiContext.dispose()
    //     //  }
    // })
    // test.afterAll(async () => {
    //     await apiContext.dispose()
    // })

    test.beforeEach(async ({ page, request }) => {      // A fresh page is provided automatically for each test
        pom = new PageObjectManager(page, request)
    })

    test.describe('Forgot Password Page Access', () => {

        test('TC-001 : Forgot Password Page link opens from login Page', async ({ page }) => {
            await pom.login.goto_Login()
            await pom.login.forgotpwd_Link.click()
            await expect(page).toHaveURL(/\/auth\/forgot-password/)     // regex last endpoints
            console.log(await pom.forgot_pwd.forgot_password_text.textContent());
        })
    })

    test.describe('Invalid Inputs in fields', () => {
        test.describe.configure({ mode: 'serial' })

        test.beforeEach(async () => {
            await pom.forgot_pwd.goto_forgot_pwd()
        })
        test('TC-002 : Invalid email shows an Error', async () => {
            await pom.forgot_pwd.password_Reset('invalid123@email.com')
            await pom.forgot_pwd.expect_invalid_email_error()
        })
        test('TC-003 : Empty/ blank email shows an Error', async () => {
            await pom.forgot_pwd.password_Reset('      ')
            await pom.forgot_pwd.expect_blank_Email_error()
        })
    })
    test('TC-004 : Registered email -> Reset Success @Regression', async () => {

        apiContext = await request.newContext()
        await new UserApi(apiContext).createUser(userdata)

        await pom.forgot_pwd.goto_forgot_pwd()
        await pom.forgot_pwd.password_Reset(userdata.email)
        await pom.forgot_pwd.expect_pwd_Reset_Success()

        await apiContext.dispose()

        //  in this website , registered email is deleted automatically, 
        // thats why we need to register again before proceed to any email relateed code
    })





})
