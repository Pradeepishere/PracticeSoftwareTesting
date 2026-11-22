import { Page, Locator, expect } from "@playwright/test";
import { userData_intf } from "../utils/testData";
import { helper, helper as util } from "../utils/helper";

export class RegisterPage {
    readonly page: Page;
    readonly customer_Register_text: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly dob: Locator;
    readonly country: Locator;
    readonly postalCode: Locator;
    readonly houseNumber: Locator;
    readonly street: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly phone: Locator;
    readonly email: Locator;
    readonly passwrod: Locator;
    readonly register_submit: Locator;
    readonly formError: Locator;
    readonly email_exists_Error: Locator;

    constructor(page: Page) {
        this.page = page;
        this.customer_Register_text = page.getByRole('heading', { name: 'Customer registration' })
        this.firstName = page.getByPlaceholder("First name *");
        this.lastName = page.getByLabel("Last name");
        this.dob = page.locator("#dob");
        this.country = page.locator("#country");
        this.postalCode = page.locator("#postal_code");
        this.houseNumber = page.locator("#house_number");
        this.street = page.locator("#street");
        this.city = page.getByPlaceholder("Your City *");
        this.state = page.getByLabel("State");
        this.phone = page.locator("#phone");
        this.email = page.getByPlaceholder("Your email *");
        this.passwrod = page.locator("#password");
        this.register_submit = page.locator(".btnSubmit.mb-3");
        this.formError = page.locator('[data-test$="-error"]'); // shows Array[]
        // can find multiple errors , use count to find 1 or More errors
        this.email_exists_Error = page.locator('[data-test="register-error"]');
    }

    async goto_Register() {
        await this.page.goto("/auth/register");
        await expect(this.page).toHaveURL(/\/auth\/register/);
        //   await expect(this.customer_Register_text).toBeVisible({ timeout: 30000 });
        await expect(this.register_submit).toBeEnabled()
        //   await expect(this.customer_Register_text).toHaveText("Customer registration");
    }
    async goto_Login() {
        await this.page.goto("/auth/login");
    }

    async fillForm(data: userData_intf) {
        // validRegistration_Data will go to data at runtime
        await expect(this.firstName).toBeVisible();
        await this.firstName.fill(data.firstName);
        await this.lastName.fill(data.lastName);
        await this.dob.fill(data.dob);

        await this.country.selectOption({ value: "AQ" });

        await this.postalCode.fill(data.postalCode);
        await this.houseNumber.fill(data.houseNumber);

        //  await this.page.waitForTimeout(2000);
        // await this.page.keyboard.press('Tab')
        // here we wait for auto fill (street, city, state) after filling postal code & houseNo,
        //await this.page.waitForTimeout(3000)

        await Promise.all([
            expect(this.street).toHaveValue(/.+/),   // sould not have value empty
            expect(this.city).toHaveValue(/.+/),
        ]);
        //  await expect(this.street).not.toHaveValue("", { timeout: 4000 }); 
        //  await expect(this.city).toHaveValue(/.+/, { timeout: 5000 });

        await this.street.fill(data.street);
        await this.city.fill(data.city);
        await this.state.fill(data.state);
        await this.phone.fill(data.phone);
        await this.email.fill(data.email);
        await this.passwrod.fill(data.password);
        //   await this.page.waitForTimeout(1000)
    }

    // async registerNew_User(user: userData) {
    //     await this.fillForm(user)
    //     await this.register_submit.click()
    // }

    async click_Register_btn() {
        await this.register_submit.click();
    }
    async expect_login_URL() {
        await expect(this.page).toHaveURL(/\/auth\/login/);
    }
    async expect_registration_URL() {
        await expect(this.page).toHaveURL(/\/auth\/register$/);
    }

    async expect_Registeration_Success() {
        await this.expect_login_URL();
        //  console.log('Succesfully registered');
        //   console.log(await this.page.url());

        // url should contains = /auth/login
        // ( /\/auth\/login$/ ) -> url must ends with /auth/login
    }
    async expect_Still_on_Registration() {
        await this.expect_registration_URL();
        console.log(await this.page.url());
        // $ -> url must ends with /auth/register
        // ( /\/auth\/register/ ) -> url should contain /auth/register

        //      (/\/auth\/(login|register)/)        or =>      (login|register)/
    }

    async waitFor_FormError() {
        // dynamically wait for 1st error to show
        await expect(this.formError.first()).toBeVisible({ timeout: 4000 });
        console.log(
            "Failed to Register = " + (await this.formError.first().innerText()),
        );
    }
    async email_alreadyExists_error() {
        await this.page.locator('[data-test="register-error"]');
        console.log(
            await this.page.locator('[data-test="register-error"]').textContent(),
        );
    }

    async waitfortimeout() {
        await this.page.waitForTimeout(2000);
    }

    /** Error element that belongs to a any field, e.g. errorFor('email') -> [id="email-error"] */
    errorFor(field: string): Locator {
        return this.page.locator(`#${field}-error`);
    }
}
