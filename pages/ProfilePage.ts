import { Page, Locator, expect } from '@playwright/test';
import { profileData, userData_intf, UpDate_profileData } from '../utils/testData';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';

export class ProfilePage {

    readonly page: Page;
    readonly profile_text: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly email: Locator;
    readonly phone: Locator;
    readonly street: Locator;
    readonly postalCode: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly update_Profile_btn: Locator;
    readonly userName: Locator;

    readonly profile_pwd_Success_loc: Locator;
    readonly profile_pwd_Error_loc: Locator;
    readonly updated_profile_msg: string;
    readonly updated_password_msg: string;

    readonly current_Password: Locator;
    readonly new_Password: Locator;
    readonly confirm_NewPassword: Locator;
    readonly change_password_btn: Locator;
    readonly signOut: Locator;


    constructor(page: Page) {
        this.page = page;
        this.profile_text = page.locator('[data-test="page-title"]')
        this.firstName = page.getByLabel('First name')
        this.lastName = page.locator('#last_name')
        this.email = page.locator('#email')
        this.phone = page.locator('[data-test="phone"]')
        this.street = page.locator('#street')
        this.postalCode = page.locator('#postal_code')
        this.city = page.locator('#city')
        this.state = page.locator('[data-test="state"]')
        this.update_Profile_btn = page.getByRole('button', { name: 'Update Profile' })
        this.userName = page.locator('#menu')

        this.profile_pwd_Success_loc = page.locator('.alert.alert-success.mt-3')
        this.profile_pwd_Error_loc = page.locator('.alert.alert-danger.mt-3')
        this.updated_profile_msg = 'Your profile is successfully updated!'
        this.updated_password_msg = 'your password is successfully updated!'

        this.current_Password = page.getByLabel('Current Password')
        this.new_Password = page.locator('#new-password')
        this.confirm_NewPassword = page.locator('[data-test="new-password-confirm"]')

        //  this.change_password_btn = page.locator('[data-test="change-password-submit"]')
        //  page.getByRole('button', { name: 'Change Password' })
        this.change_password_btn = page.getByRole('button', {
            name: 'Change Password',
            exact: true
        })
        this.signOut = page.locator('[data-test="nav-sign-out"]')

    }
    async getName(username: string) {
        return await this.page.getByText(username, { exact: true })
    }

    async goto_profile(data: userData_intf, login: LoginPage, home: HomePage, profile: ProfilePage) {

        await login.goto_Login()
        await login.login_cred(data.email, data.password)

        //  await home.expect_UserName(data)    // as updated chanes name, leads to error
        await home.userName.click()
        await home.MyProfile.click()
        await expect(profile.profile_text).toBeVisible()
        await expect(this.page).toHaveURL(/\/account\/profile/)

        //  await this.page.waitForTimeout(2000)
        console.log('goto_profile Method : Completed');
    }

    async expect_profile_Page() {
        await this.expect_profile_URL()
    }
    async expect_profile_URL() {
        await expect(this.page).toHaveURL(/\/profile/)  // profile at the end of URL should be present
        await expect(this.profile_text).toBeVisible()
        console.log(await this.profile_text.textContent())
    }
    async fillProfile_change(data: profileData) {

        if (data.firstName !== undefined) {
            console.log('After Update : ' + data.firstName);
            await this.firstName.fill(data.firstName)
        }
        if (data.lastName !== undefined) {
            await this.lastName.fill(data.lastName)
        }
        if (data.phone !== undefined) {
            await this.phone.fill(data.phone)
        }
        if (data.street !== undefined) {
            await this.street.fill(data.street)
        }
        if (data.postalCode !== undefined) {
            await this.postalCode.fill(data.postalCode)
        }
        if (data.city !== undefined) {
            await this.city.fill(data.city)
        }
        if (data.state !== undefined) {
            await this.state.fill(data.state)
        }
    }

    async saveProfile() {
        await this.update_Profile_btn.click()
    }

    async fill_PasswordChange(current_pwd: string, new_pwd: string, confirm_pwd: string) {
        await this.current_Password.fill(current_pwd)
        await this.new_Password.fill(new_pwd)
        await this.confirm_NewPassword.fill(confirm_pwd)

        // console.log(await this.change_password_btn.textContent());
        await expect(this.change_password_btn).toBeVisible()
        console.log('Button Change-Password Enabled : ' + await this.change_password_btn.isEnabled());
        await this.change_password_btn.waitFor({ state: 'visible' })
        //  await expect(this.change_password_btn).toBeInViewport()
        await this.change_password_btn.click()
    }

    async changePwd_Btn_click() {
        const msg_error = await this.profile_pwd_Error_loc.waitFor({ state: 'visible', timeout: 10000 })
            .then(() => true)
            .catch(() => false)
        if (!msg_error) {
            await this.change_password_btn.click()
        }
    }

    async expect_InputValues(data: profileData) {

        if (data.firstName !== undefined) {
            await expect(this.firstName).toHaveValue(data.firstName);
        }
        if (data.lastName !== undefined) {
            await expect(this.lastName).toHaveValue(data.lastName);
        }
        if (data.phone !== undefined) {
            await expect(this.phone).toHaveValue(data.phone);
        }
        if (data.street !== undefined) {
            await expect(this.street).toHaveValue(data.street);
        }
        if (data.postalCode !== undefined) {
            await expect(this.postalCode).toHaveValue(data.postalCode);
        }
        if (data.city !== undefined) {
            await expect(this.city).toHaveValue(data.city);
        }
        if (data.state !== undefined) {
            await expect(this.state).toHaveValue(data.state);
        }
        console.log('In expect_InputValues method : ' + await this.state.inputValue());
    }




}