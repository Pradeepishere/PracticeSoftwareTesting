import { Page, Locator, expect } from '@playwright/test';
//import { userData } from '../utils/testData';

export class ForgotPasswordPage {

    readonly page: Page;
    // readonly forgot_password : Locator;       // present in Login page
    readonly forgot_password_text: Locator;
    readonly email: Locator;
    readonly setNewPwd_btn: Locator;
    readonly Success_forgot_pwd: Locator;
    readonly email_req_error: Locator;
    readonly email_Invalid_error: Locator;

    constructor(page: Page) {
        this.page = page
        this.forgot_password_text = page.locator('h1:has-text("Forgot Password")')
        this.email = page.getByPlaceholder('Your email')
        this.setNewPwd_btn = page.locator('.btnSubmit')
        this.Success_forgot_pwd = page.locator('.alert.alert-success.mt-3')
        this.email_req_error = page.locator('#email-error')
        this.email_Invalid_error = page.locator('.alert.alert-danger.mt-3')

    }

    async goto_forgot_pwd() {
        await this.page.goto('/auth/forgot-password')
        await expect(this.page).toHaveURL(/\/auth\/forgot-password/)
        await expect(this.forgot_password_text).toBeVisible()
        // console.log(await this.forgot_password_text.textContent());
    }
    async password_Reset(email: string) {
        await this.email.fill(email)
        await this.setNewPwd_btn.click()
    }
    async expect_pwd_Reset_Success() {
        await expect(this.Success_forgot_pwd).toBeVisible()
        console.log(await this.Success_forgot_pwd.textContent());
    }
    async expect_blank_Email_error() {
        await expect(this.email_req_error).toBeVisible()
        console.log(await this.email_req_error.textContent());
        await expect(await this.email_req_error.textContent()).toBe('Email is required')
    }
    async expect_invalid_email_error() {
        await expect(this.email_Invalid_error).toBeVisible()
        console.log(await this.email_Invalid_error.textContent());
        await expect(await this.email_Invalid_error.textContent()).toBe('The selected email is invalid. ')

    }



}