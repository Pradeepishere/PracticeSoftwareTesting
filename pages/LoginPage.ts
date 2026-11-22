import { Page, Locator, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage'
import { userData_intf } from '../utils/testData';


export class LoginPage {

    readonly page: Page;
    readonly login_Text: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly login_btn: Locator;
    readonly email_error: Locator;
    readonly password_req: Locator;
    readonly login_error_msg: Locator;
    readonly forgotpwd_Link: Locator;

    readonly myAccount_title: Locator;
    readonly name_Menu: Locator
    readonly profilePage: Locator;
    readonly signOut: Locator

    constructor(page: Page) {
        this.page = page
        this.login_Text = page.getByRole('heading', { name: 'Login' });
        this.email = page.getByLabel('Email address *')
        this.password = page.getByPlaceholder('Your password')
        this.login_btn = page.getByRole('button', { name: 'Login', exact: true })
        this.email_error = page.locator('#email-error')
        this.password_req = page.locator('#password-error')
        this.login_error_msg = page.locator('[data-test="login-error"]')

        this.myAccount_title = page.locator('[data-test="page-title"]')
        this.name_Menu = page.locator('#menu')
        this.profilePage = page.getByRole('link', { name: "Profile" })
        this.signOut = page.locator('[data-test="nav-sign-out"]')
        this.forgotpwd_Link = page.getByRole('link', { name: 'Forgot your Password?' })
    }

    async goto_Login() {
        await this.page.goto('/auth/login')
        // await this.page.waitForTimeout(3000)
        await expect(this.page).toHaveURL(/\/auth\/login/)
        await expect(this.login_btn).toBeVisible({ timeout: 20000 })
    }
    async login_cred(email: string, password: string) {
        await this.email.fill(email)
        await this.password.fill(password)
        // await this.page.waitForTimeout(3000)
        await expect(this.login_btn).toBeEnabled()
        await this.login_btn.click()
    }
    async expect_LoggedIn() {
        await this.login_Text.waitFor({ state: 'hidden', timeout: 10000 })
        await expect(this.page).toHaveURL(/\/account/)
        //   console.log('My Account Page after Logged In : ' + this.page.url());
        //   console.log('My account text : ' + await this.myAccount_title.textContent());
        await expect(this.myAccount_title).toHaveText('My account')
        await expect(this.page.getByRole('link', { name: 'Favorites' })).toBeVisible()

    }
    async expect_LoggedOut() {
        await expect(this.page).toHaveURL(/\/auth\/login/)
    }
    async print_Url() {
        console.log('URL : ', this.page.url());
    }

    async logOut() {
        await expect(this.name_Menu).toBeVisible()
        await this.name_Menu.click()
        await this.signOut.click()
    }

    async loginFails_then_registerUser(userdata: userData_intf) {

        await this.login_cred(userdata.email, userdata.password)

        // await this.login_error_msg.waitFor({ state: 'visible' })
        const invalidLogin_msg = await this.login_error_msg     // msg -> Invalid email or password
            .waitFor({ state: 'visible', timeout: 4000 })
            .then(() => true)       // If visible: the promise resolves,  results in True
            .catch(() => false)     // promise rejects, if element does'nt become visible within 3 seconds
        // converts failure into false

        if (invalidLogin_msg) {     // invalidLogin_msg = true
            //  console.log(await this.login_error_msg.textContent());  // print error msgs
            const register = new RegisterPage(this.page)
            await register.goto_Register()
            //   console.log(this.page.url());

            await register.fillForm(userdata)
            await register.click_Register_btn()

            const emailAlreadyExists_Error = await register.email_exists_Error
                .waitFor({ state: 'visible', timeout: 4000 })
                .then(() => true)       // email already exists Msg shows - true
                .catch(() => false)     // if email already exists doesnt show -> false

            if (emailAlreadyExists_Error) {
                await expect(register.email_exists_Error).toBeVisible()
                //  console.log(await register.email_exists_Error.textContent());

            } else {
                await register.expect_Registeration_Success()
                await this.login_cred(userdata.email, userdata.password)
                await this.logOut()
            }
        }
        else {
            await this.logOut()
        }

    }





}
