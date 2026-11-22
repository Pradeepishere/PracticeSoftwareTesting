import { Page, Locator, expect, Browser } from '@playwright/test';
import { validRegistration_Data, userData_intf, uniqueEmail } from '../utils/testData';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';

export class helper {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }
    async waitfortimeOut() {
        await this.page.waitForTimeout(2000)
    }

    async expect_login_URL() {      // can be used directly tests
        await expect(this.page).toHaveURL(/\/auth\/login/)
    }

    async expect_registration_URL() {
        await expect(this.page).toHaveURL(/\/auth\/register$/)
    }
    async re_register(newpage: Page, data: userData_intf): Promise<void> {
        //const context = await browser.newContext()
        // const newpage = await context.newPage()
        const setup_Login = new LoginPage(newpage)
        const profile = new ProfilePage(newpage)
        await setup_Login.goto_Login();
        await setup_Login.loginFails_then_registerUser(data)


        await setup_Login.login_cred(data.email, data.password)
        await expect(newpage).toHaveURL(/\/account/)
        await expect(setup_Login.name_Menu).toBeVisible()
        await console.log('Logged in : ', await newpage.url());

        await setup_Login.profilePage.click()
        await expect(profile.firstName).toBeVisible()
        await console.log('Logged in : ', await newpage.url());

        await console.log('Succesfully Registered / Already Registered : ', data.email, data.password);
        await newpage.locator('#menu').click()
        await newpage.locator('[data-test="nav-sign-out"]').click()
    }

    async fresh_Page(browser: Browser) {
        const context = await browser.newContext()
        const page = await context.newPage()
        return page
    }
    async generateRandomNumber(): Promise<number> {
        return Math.floor(Math.random() * 10000) + 1;
    }

    async generate_Email_Pwd(): Promise<{ email: string; password: string }> {
        return {
            email: `Rahul.sharma_#_${Math.floor(Math.random() * 10000)}@email.com`,
            password: `Pass_#_${Math.floor(Math.random() * 10000)}@_2026`
        };
    }
    // const userData = await this.generate_Email_Pwd();
    // call like this
    //console.log(userData.email);
    //console.log(userData.password);

    // const { email, password } = await this.generate_Email_Pwd();
}



// import { test, expect, Page, BrowserContext } from '@playwright/test';
// import { UpDate_profileData, profileData, dynamic_buildUser_Data } from '../utils/testData';
// import { ProfilePage } from '../pages/ProfilePage';
// import { LoginPage } from '../pages/LoginPage';
// import { HomePage } from '../pages/HomePage';
// import { helper } from '../utils/helper';


// test.describe('Profile Page update', () => {
//     let profile: ProfilePage;
//     let login: LoginPage;
//     let util: helper;
//     let home: HomePage;
//     const userData = dynamic_buildUser_Data(
//         { email: 'rahul.sharma2026_14_@example.com', password: 'Rahul2026@6' })

//     const userData_pwdTests = dynamic_buildUser_Data(
//         { email: 'tim.roswell_2011_04_@example.com', password: 'Tim2026@15' })
//     // used for Password change testing, so that it doesnt affect other tests

//     const profile_data = {     // await profile.fillProfile(UpDate_profileData)
//         firstName: 'Tom987',
//         lastName: 'Jerry987',
//         phone: '9876543210',
//         street: 'MG Road',
//         postalCode: '1001',
//         city: 'New Delhi',
//         state: 'Delhi'
//     }

//     test.beforeAll(async ({ browser }) => {
//         const context = await browser.newContext()
//         const newpage = await context.newPage()

//         util = new helper(newpage);
//         await util.re_register(newpage, userData, browser)

//         await util.re_register(newpage, userData_pwdTests, browser)    // for Password change tests
//         await context.close()
//     })

//     test.beforeEach(async ({ page }) => {
//         login = new LoginPage(page)
//         home = new HomePage(page)
//         profile = new ProfilePage(page)

//         // await profile.goto_profile(userData, login, home, profile)   // as it is effected by passworde change tests
//     })

//     async function openProfile_userData(user: typeof userData) {         // ( user: typeof profileUser,) -> as parameter
//         await profile.goto_profile(userData, login, home, profile)
//     }
//     async function openProfile_userData_pwdTests(user: typeof userData_pwdTests) {
//         await profile.goto_profile(userData_pwdTests, login, home, profile)
//     }

//     test.describe('Page Access', () => {
//         test('TC-001 : Profile page access', async () => {
//             await openProfile_userData(userData)

//             await expect(profile.profile_text).toBeVisible()
//             console.log(await profile.profile_text.textContent());
//             console.log('TC-001 : Succesfully tested');
//         })
//     })

//     test.describe('Updating profile', () => {
//         test.describe.configure({ mode: 'serial' });

//         test.beforeEach(async () => {
//             await openProfile_userData(userData)    // opens profile Page after login
//         })

//         test('TC-002 : Profile shows registered details of User', async () => {
//             await profile.expect_InputValues(userData)

//             const expected_Name = await home.join_first_last_Name(userData.firstName, userData.lastName)
//             console.log('Name : ' + expected_Name);
//             await expect(home.userName).toHaveText(expected_Name)
//             console.log('TC-002 : Succesfully tested');
//         })

//         test('TC-003 : Update each field -> reLoad page -> all fields are updated', async ({ page }) => {
//             console.log(userData.firstName);
//             await expect(profile.firstName).toHaveValue(userData.firstName)

//             // const { phone, street, postalCode } = UpDate_profileData;
//             // await profile.fillProfile({ phone, street, postalCode })

//             // const profile_data = {     // await profile.fillProfile(UpDate_profileData)
//             //     firstName: 'Tom987',
//             //     lastName: 'Jerry987',
//             //     phone: '9876543210',
//             //     street: 'MG Road',
//             //     postalCode: '1001',
//             //     city: 'New Delhi',
//             //     state: 'Delhi'
//             // }
//             await profile.fillProfile_change(profile_data)
//             await page.waitForTimeout(3000)
//             await profile.saveProfile()     // click on submit button

//             await expect(await profile.profile_pwd_Success_loc).toBeVisible()
//             await expect(await profile.profile_pwd_Success_loc).toContainText(profile.updated_profile_msg)
//             console.log(await profile.profile_pwd_Success_loc.textContent());

//             await page.reload()
//             await page.waitForTimeout(2000)
//             await profile.expect_InputValues(UpDate_profileData)
//             console.log('TC-003 : Succesfully tested');

//             // Reset to old Profile data
//             // go to practice.spec.ts, Run & see TC-003

//         })
//         test('TC-004 : Change only 1 field -> Country to Mumbai', async ({ page }) => {
//             const runtimeData_city: profileData = {
//                 ...UpDate_profileData,   // as this details are aleady filled , thats why this is skipped
//                 city: 'Mumbai'  // only city is changed
//             }
//             await expect(profile.firstName).toHaveValue(profile_data.firstName)
//             await profile.fillProfile_change(runtimeData_city)
//             await page.waitForTimeout(2000)
//             await profile.update_Profile_btn.click()
//             await page.reload()
//             await page.waitForTimeout(2000)

//             console.log('TC-004 : Succesfully tested');
//         })
//         test('TC-005 : Updated first name shows in the navigation menu', async () => {
//             const expected_Name = await home.join_first_last_Name(profile_data.firstName, profile_data.lastName)
//             console.log('Name : ' + expected_Name);
//             await expect(home.userName).toHaveText(expected_Name)

//             console.log('TC-005 : Succesfully tested')
//         })
//         test('Restore Original  Profile details', async ({ page }) => {
//             await expect(profile.firstName).not.toHaveValue('')     // should not be empty
//             await profile.fillProfile_change(userData)
//             await profile.update_Profile_btn.click()
//             await page.reload()
//             await profile.expect_InputValues(userData)

//         })
//     })

//     // EP: mandatory + invalid values
//     test.describe('Profile Validation', () => {

//         test.beforeEach(async () => {
//             await openProfile_userData(userData)
//         })

//         test('TC-006 : Email field is only read-Only, not Editable', async () => {
//             await expect(profile.email).toHaveValue(userData.email)
//             console.log(await profile.email.textContent());

//             await expect(profile.email).toHaveAttribute('readonly', '');
//             await expect(profile.email).not.toBeEditable();

//             console.log('TC-006: Succesfully tested');
//         })
//         test('TC-007 : Empty firstName shows an Error', async () => {

//             await expect(profile.firstName).not.toHaveValue('') // something should be present
//             await profile.firstName.fill('')
//             await profile.update_Profile_btn.click()
//             await expect(profile.profile_pwd_Error_loc).toBeVisible()
//             console.log(await profile.profile_pwd_Error_loc.textContent());

//             console.log('TC-007: Succesfully tested');
//         })

//         const invalidPhones = ['abcdefghij', '12-34-ab', '!!!@@@###', '   ']
//         for (const phone_1 of invalidPhones) {
//             test(`TC-008 : Invalid Phone no. ${phone_1} is Rejected`, async ({ page }) => {
//                 await expect(profile.phone).not.toHaveValue('') // something should be present
//                 await profile.phone.fill(phone_1)
//                 await profile.update_Profile_btn.click()
//                 await expect(profile.profile_pwd_Error_loc).toBeVisible()
//                 console.log(await profile.profile_pwd_Error_loc.textContent());

//                 console.log('TC-008 : Succesfully tested');
//             })
//         }
//     })
//     //      Password reset (change password)

//     test.describe('Profile - Change Password with Invalid', () => {

//         test.beforeEach(async () => {
//             await openProfile_userData_pwdTests(userData_pwdTests)
//         })

//         const old_pwd_01 = userData_pwdTests.password       // Tim2026@15
//         const new_pwd_01 = 'N3w!Passw0rd#2026'
//         const confirm_pwd_01 = 'N3w!Passw0rd#2026'

//         async function change_with_multiple_Pwd(curr_pwd: string, newPwd: string, cfrmPwd: string) {
//             await profile.fill_PasswordChange(curr_pwd, newPwd, cfrmPwd)
//             console.log(await profile.profile_pwd_Error_loc.textContent())
//             await expect(profile.profile_pwd_Error_loc).toBeVisible()
//             console.log(await profile.profile_pwd_Error_loc.textContent())
//         }

//         const weakPasswords = [
//             { name: 'less than 7-char', new_password: 'Aa1!aaa' },
//             { name: 'no uppercase', new_password: 'abcdef1!gh' },
//             { name: 'no lowercase', new_password: 'ABCDEF1!GH' },
//             { name: 'no digit', new_password: 'Abcdefg!hi' },
//             { name: 'no symbol', new_password: 'Abcdefg1hi' }
//         ]

//         test('TC-009 : Same password as Current pwd is Rejected', async () => {
//             await change_with_multiple_Pwd(old_pwd_01, old_pwd_01, old_pwd_01)
//             console.log('TC-009 : Succesfully tested')
//         })
//         test('TC-010 : Wrong current password is rejected : ', async () => {
//             await change_with_multiple_Pwd('Wr0ng!Current1', new_pwd_01, confirm_pwd_01)
//             console.log('TC-010 : Succesfully tested')
//         })
//         test('TC-011 : New password and Confirmation password must match : ', async () => {
//             await change_with_multiple_Pwd(old_pwd_01, new_pwd_01, 'Wrong@Confirm_pwd')
//             console.log('TC-011 : Succesfully tested')
//         })

//         for (const data of weakPasswords) {
//             test(`TC-012 : Reject Password with ${data.name} : ${data.new_password}`, async () => {
//                 await change_with_multiple_Pwd(old_pwd_01, data.new_password, data.new_password)
//                 console.log(`TC-012 with ${data.name}: Succesfully tested`)
//             })
//         }
//     })

//     // State transition: logged in -> password changed -> logged out ->
//     //  logged in with new password

//     test.describe('Change password - valid + state transition', async () => {

//         test.describe.configure({ mode: 'serial' })

//         const old_pwd_02 = userData_pwdTests.password       // Tim2026@15       tim.roswell_2011_001_@example.com
//         const new_pwd_02 = 'N3w!Passw0rd#2026_01'
//         const confirm_pwd_02 = 'N3w!Passw0rd#2026_01'

//         test('TC-013 : Valid Password accepted & user is logged out', async ({ page }) => {

//             await openProfile_userData_pwdTests(userData_pwdTests)   // login once with original credentials,
//             //  then credentials are changed for testing

//             await profile.fill_PasswordChange(old_pwd_02, new_pwd_02, confirm_pwd_02)
//             await page.waitForTimeout(2000)

//             await expect(profile.profile_pwd_Success_loc).toBeVisible()
//             console.log(await profile.profile_pwd_Success_loc.textContent())
//             await login.expect_LoggedOut()
//             //   await page.goto('/account/profile')     // session expired & ur thrown to login pafe
//             //  await expect(page).toHaveURL(/\/auth\/login/)

//             console.log('TC-013 : Succesfully tested')
//         })
//         test('TC-014 : Old password fails & logs in with New Password', async () => {

//             await login.goto_Login()
//             await login.login_cred(userData_pwdTests.email, old_pwd_02)
//             await expect(login.login_error_msg).toBeVisible()
//             console.log(await login.login_error_msg.textContent());

//             await login.login_cred(userData_pwdTests.email, new_pwd_02)
//             await login.expect_LoggedIn()
//             console.log('TC-014 : Succesfully tested')
//         })
//         test('TC-015 : Restore original Password', async () => {     // sometimes change_Password button works & not

//             await login.goto_Login()
//             await login.login_cred(userData_pwdTests.email, new_pwd_02)
//             await home.profile_loc.click()
//             await profile.fill_PasswordChange(new_pwd_02, old_pwd_02, old_pwd_02)
//             if (await profile.change_password_btn.isEnabled()) {
//                 await profile.change_password_btn.click()
//             }
//             await expect(profile.profile_pwd_Success_loc).toBeVisible()
//             await login.expect_LoggedOut()

//             console.log('TC-015 : Succesfully tested')
//         })

//     })



// })
