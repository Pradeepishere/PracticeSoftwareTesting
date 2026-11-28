import { test, expect, request } from '@playwright/test';
import { validRegistration_Data, dynamic_buildUser_Data, uniqueEmail, dynamic_API_UserData } from '../utils/testData';
import { UserApi } from '../utils/userApi';
import { PageObjectManager } from '../pages/PageObjectManager';


test.describe('Login Page', () => {

    test.use({              // remove storage state for this describe tests
        storageState: { cookies: [], origins: [] },
    });

    let pom: PageObjectManager;
    const user_email = uniqueEmail()
    let userdata = dynamic_API_UserData({ email: user_email })

    test.beforeAll(async () => {
        userdata = dynamic_API_UserData({ email: user_email })

        const apiContext = await request.newContext()
        await new UserApi(apiContext).createUser(userdata)  // create new User through API
        await apiContext.dispose()

        // const context = await browser.newContext()
        // const newpage = await context.newPage()
        // util = new helper(newpage);

        // await util.re_register(newpage, userdata)
        // await context.close()
    })

    test.beforeEach(async ({ page, request }) => {
        pom = new PageObjectManager(page, request)
    })

    // test.describe.configure({ mode: 'serial' })
    test.describe('Test Cases for Login Page', () => {

        // test.describe.configure({ mode: 'serial' });        // Optional
        test.beforeEach(async () => {
            await pom.login.goto_Login()
        })

        test('TC-Login-001 : Login form Elements are displayed', async ({ page }) => {
            await expect(page).toHaveURL(/\/auth\/login/)
            await expect(pom.login.email).toBeVisible()
            await expect(pom.login.password).toBeVisible()
            await expect(pom.login.login_btn).toBeVisible()
            await expect(page).toHaveURL(/\/auth\/login/)
            console.log('All login form Elements are displayed');

        })
        test('TC-Login-002 : User logs in with Valid Credentials @Regression', async ({ page }) => {
            await expect(page).toHaveURL(/\/auth\/login/)
            console.log('Password : ', userdata.password);

            await pom.login.login_cred(user_email, userdata.password)
            await page.waitForTimeout(1000)
            await pom.login.expect_LoggedIn()
            await pom.login.logOut()
            await pom.login.expect_LoggedOut()
        })
    })

    // In-Valid credentials/ partitions

    test.describe('In-Valid credentials', () => {

        //   test.describe.configure({ mode: 'serial' });        // Optional
        test.beforeEach(async () => {
            await pom.login.goto_Login()
        })

        test('TC-001 : Wrong Password show error/ rejected', async () => {
            await pom.login.login_cred(user_email, 'Wr0ng!Password123')
            await expect(pom.login.login_error_msg).toBeVisible()
            console.log('Error msg : ' + await pom.login.login_error_msg.textContent());
        })
        test('TC-002 : Unknown Email shows error/ rejected', async () => {
            await pom.login.login_cred('unknown.user.12345@example.com', userdata.password)
            await expect(pom.login.page).toHaveURL(/\/auth\/login/)
            console.log('Error msg : ' + await pom.login.login_error_msg.textContent());
        })
        test('TC-003 : Empty login email & Password shows Required errors', async () => {
            // await expect(pom.login.login_btn).toBeVisible()
            await pom.login.login_btn.click()
            await expect(pom.login.email_error).toBeVisible()
            await expect(pom.login.password_req).toBeVisible()
            console.log('Email req : ' + await pom.login.email_error.textContent())
            console.log('Email req : ' + await pom.login.password_req.textContent())
        });
        test('TC-004 : In-Valid email format is rejected', async () => {
            await pom.login.login_cred('not-an-email', userdata.password)
            await expect(pom.login.email_error).toBeVisible()
            console.log('Email Invalid formart : ' + await pom.login.email_error.textContent());
        })
        test('TC-005 : SQL injection in Login fields doesnot logs in', async ({ page }) => {
            await pom.login.login_cred("' OR '1'='1", "' OR '1'='1+")  // email, password
            await expect(page).not.toHaveURL(/\/account/) // URL ends at account 
            await expect(pom.login.login_btn).toBeVisible()
        })
        test('TC-006 : Email is case-InSensitive in this WebSite & Accepted', async ({ page }) => {
            await expect(page).toHaveURL(/\/auth\/login/)
            await pom.login.login_cred(user_email.toUpperCase(), userdata.password)
            await pom.login.expect_LoggedIn()
        })
        test('TC-007 : login -> my Account page -> logOut returns to -> login Page', async ({ page }) => {
            //  await expect(page).toHaveURL(/\/auth\/login/)
            await pom.login.login_cred(user_email, userdata.password)
            await pom.login.expect_LoggedIn()
            await pom.login.logOut()
            await expect(page).toHaveURL(/\/auth\/login/)
        })
        test('TC-008 : Protected Page (My Account Page) redirects to login page After SignOut/ LogOut', async ({ page }) => {
            await page.goto('/account')     // https://practicesoftwaretesting.com/account
            await expect(page).toHaveURL(/\/auth\/login/)
        })
        test('TC-009 : Session persists after page reload', async ({ page }) => {
            // await expect(page).toHaveURL(/\/auth\/login/)
            await pom.login.login_cred(user_email, userdata.password)
            await pom.login.expect_LoggedIn()
            await page.reload()
            await expect(page).toHaveURL(/\/account/)
        })
    })
})

