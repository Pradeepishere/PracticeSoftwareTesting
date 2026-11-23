import { Page } from '@playwright/test';
import { userData_intf, UpDate_profileData, getProfile_credfrom_Json, getPwd_credfrom_Json, UserData_intf_API, profileData, Api_data, getlogin_userData } from '../utils/testData';
import { promises as fs } from 'node:fs';
import { PageObjectManager } from '../pages/PageObjectManager';
import { test, expect } from '../fixtures/login.fixture';


test.describe('Profile Page update', () => {

    let pom: PageObjectManager;

    let userData_profile: UserData_intf_API;
    let userData_pwdTests: UserData_intf_API;
    let login_userdata: userData_intf;

    test.beforeAll(async () => {     // Read JSON and store email/password in profile & pwd userData
        // Register through api

        userData_profile = await getProfile_credfrom_Json()
        userData_pwdTests = await getPwd_credfrom_Json()
        login_userdata = await getlogin_userData()
    })

    test.beforeEach(async ({ page, request }) => {
        pom = new PageObjectManager(page, request)
    })

    const profile_data = {     // await profile.fillProfile(UpDate_profileData)
        firstName: 'Tom_987',
        lastName: 'Jerry_987',
        phone: '9876543210',
        street: 'MG Road',
        postalCode: '987',
        city: 'New Delhi',
        state: 'Delhi'
    }

    //test.beforeAll(async ({ browser }) => {
    // const context = await browser.newContext()
    //const newpage = await context.newPage()

    //util = new helper(newpage);
    // await util.re_register(newpage, userData)

    //   await util.re_register(newpage, userData_pwdTests, browser)    // for Password change tests
    //await context.close()
    //  })

    async function openProfile_page(page: Page) {
        await page.goto('/account/profile');
        // await expect(pom.profile.profile_text).toBeVisible({ timeout: 20000 });
    }

    test.describe('Page Access', () => {
        test('TC-001 : Profile page access', async ({ page, pom, loggedInUser }) => {
            await openProfile_page(page)

            await console.log(await pom.profile.profile_text.textContent());
            await console.log('TC-001 : Succesfully tested');
        })
    })

    test.describe('Updating profile', () => {
        test.describe.configure({ mode: 'serial' });

        test.beforeEach(async ({ page }) => {
            await openProfile_page(page)
            await expect(pom.profile.firstName).toHaveValue(/.+/, { timeout: 30000 })
        })

        test('TC-002 : Profile shows registered details of User', async () => {
            console.log('------------------------');

            await expect(await pom.profile.firstName).toBeVisible()
            console.log('FirstName : ', await pom.profile.firstName.inputValue());

            const streetName = await pom.profile.street.inputValue()
            await console.log('street name : ', streetName, ' = ', Api_data.address.street);

            await expect(pom.profile.street).toHaveValue(userData_profile.address.street)

            const expected_Name = await pom.home.join_first_last_Name(userData_profile.first_name, userData_profile.last_name)
            await console.log('Name : ' + expected_Name);
            await expect(pom.profile.userName).toHaveText(expected_Name)
            await console.log('TC-002 : Succesfully tested');
        })

        test('TC-003 : Update each field -> reLoad page -> all fields are updated', async ({ page }) => {
            await console.log(userData_profile.first_name);
            await expect(pom.profile.firstName).toHaveValue(userData_profile.first_name)

            await pom.profile.fillProfile_change(profile_data)
            // await page.waitForTimeout(2000)
            await pom.profile.saveProfile()     // click on submit button

            await expect(await pom.profile.profile_pwd_Success_loc).toBeVisible()
            await expect(await pom.profile.profile_pwd_Success_loc).toContainText(pom.profile.updated_profile_msg)
            await console.log(await pom.profile.profile_pwd_Success_loc.textContent());

            await page.reload()
            // await page.waitForTimeout(2000)
            await pom.profile.expect_InputValues(UpDate_profileData)
            await console.log('TC-003 : Succesfully tested');

            // Reset to old Profile data
            // go to practice.spec.ts, Run & see TC-003

        })
        test('TC-004 : Change only 1 field -> Country to Mumbai', async ({ page }) => {
            const runtimeData_city: profileData = {
                ...UpDate_profileData,   // as this details are aleady filled , thats why this is skipped
                city: 'Mumbai'  // only city is changed
            }
            await expect(pom.profile.firstName).toHaveValue(profile_data.firstName)
            await expect(pom.profile.update_Profile_btn).toBeEnabled()
            await pom.profile.fillProfile_change(runtimeData_city)
            // await page.waitForTimeout(2000)
            await pom.profile.update_Profile_btn.click()
            await expect(pom.profile.profile_pwd_Success_loc).toBeVisible()
            await expect(await pom.profile.profile_pwd_Success_loc.textContent()).toBe(pom.profile.updated_profile_msg)

            await page.reload()
            // await page.waitForTimeout(2000)
            await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
            await expect(pom.profile.city).toHaveValue('Mumbai')

            console.log('TC-004 : Succesfully tested');
        })
        test('TC-005 : Updated first name shows in the navigation menu', async () => {
            const expected_Name = await pom.home.join_first_last_Name(profile_data.firstName, profile_data.lastName)
            await console.log('Name : ' + expected_Name);
            await expect(pom.profile.userName).toHaveText(expected_Name)

            await console.log('TC-005 : Succesfully tested')
        })
        test('TC-005 - B : Restore Original  Profile details', async ({ page }) => {
            await expect(pom.profile.firstName).not.toHaveValue('')     // should not be empty
            const data = {
                firstName: 'John',
                lastName: 'Mox',
                phone: '0987654321',
                street: 'Avenue_01',
                postalCode: '1001',
                city: 'New York',
                state: 'Alaska'
            }
            await pom.profile.fillProfile_change(data)
            await pom.profile.update_Profile_btn.click()
            await expect(pom.profile.profile_pwd_Success_loc).toBeVisible()
            await expect(await pom.profile.profile_pwd_Success_loc.textContent()).toBe(pom.profile.updated_profile_msg)

            await page.reload()
            await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
            await expect(pom.profile.firstName).not.toHaveValue('')
            await pom.profile.expect_InputValues(data)

            await console.log('TC-005 - B : Succesfully tested')
        })
    })

    // EP: mandatory + invalid values
    test.describe('Profile Validation', () => {

        //    test.describe.configure({ mode: 'serial' });        // Optional

        test.beforeEach(async ({ page }) => {
            await openProfile_page(page)
        })

        test('TC-006 : Email field is only read-Only, not Editable', async () => {
            // await pom.home.timeout()
            await expect(pom.profile.lastName).toHaveValue(/.+/, { timeout: 30000 });
            await expect(pom.profile.email).toHaveValue(userData_profile.email, { timeout: 30000 })
            await console.log(await pom.profile.email.inputValue());

            await expect(pom.profile.email).toHaveAttribute('readonly', '');
            await expect(pom.profile.email).not.toBeEditable();

            await console.log('TC-006: Succesfully tested');
        })
        test('TC-007 : Empty firstName shows an Error', async () => {

            await expect(pom.profile.firstName).not.toHaveValue('') // something should be present
            await pom.profile.firstName.fill('')
            await pom.profile.update_Profile_btn.click()
            await expect(pom.profile.profile_pwd_Error_loc).toBeVisible()
            await console.log(await pom.profile.profile_pwd_Error_loc.textContent());

            await console.log('TC-007: Succesfully tested');
        })

        test.describe(async () => {
            test.use({ storageState: 'auth.login_userData.json' })

            const invalidPhones = ['abcdefghij', '12-34-ab', '!!!@@@###', '   ']

            for (const phone_1 of invalidPhones) {
                test(`TC-008 : Invalid Phone no. ${phone_1} is Rejected`, async ({ page }) => {
                    await page.goto('/account/profile')

                    await expect(pom.profile.phone).toHaveValue(/.+/, { timeout: 10000 }) // something should be present

                    await pom.profile.phone.fill(phone_1)
                    await pom.profile.update_Profile_btn.click()
                    await expect(pom.profile.profile_pwd_Error_loc).toBeVisible()
                    await console.log(await pom.profile.profile_pwd_Error_loc.textContent());

                    await console.log('TC-008 : Succesfully tested');
                })
            }
        })
    })
    //      Password reset (change password)

    test.describe('Profile Password change, Reset tests', () => {
        test.describe.configure({ mode: 'serial' })

        test.describe('Change Password with Invalid', async () => {

            test.use({ storageState: 'auth.password_user.json' })

            let old_pwd_01: string;
            const new_pwd_01 = 'N3w!Passw0rd#2026'
            const confirm_pwd_01 = 'N3w!Passw0rd#2026'

            test.beforeAll(async () => {
                old_pwd_01 = userData_pwdTests.password;
            });

            test.beforeEach(async ({ page }) => {
                await openProfile_page(page)
                await expect(await pom.profile.firstName).toBeVisible()
            })

            async function change_with_multiple_Invalid_Pwd(curr_pwd: string, newPwd: string, cfrmPwd: string) {
                await pom.profile.fill_PasswordChange(curr_pwd, newPwd, cfrmPwd)
                await pom.profile.changePwd_Btn_click()     // if necessary use this

                await expect(pom.profile.profile_pwd_Error_loc).toBeVisible()
                await console.log('Pwd Error : ', await pom.profile.profile_pwd_Error_loc.textContent())
            }

            test('TC-009 : Same password as Current pwd is Rejected', async () => {
                await change_with_multiple_Invalid_Pwd(old_pwd_01, old_pwd_01, old_pwd_01)

                await pom.util.waitfortimeOut()
                await console.log('TC-009 : Succesfully tested')
            })
            test('TC-010 : Wrong current password is rejected : ', async () => {
                await change_with_multiple_Invalid_Pwd('Wr0ng!Current1', new_pwd_01, confirm_pwd_01)

                await pom.util.waitfortimeOut()

                await console.log('TC-010 : Succesfully tested')
            })
            test('TC-011 : New password and Confirmation password must match : ', async () => {

                await change_with_multiple_Invalid_Pwd(old_pwd_01, new_pwd_01, 'Wrong@Confirm_pwd')
                //await util.waitfortimeOut()
                await console.log('TC-011 : Succesfully tested')
            })

            const weakPasswords = [
                { name: 'less than 7-char', new_password: 'Aa1!aaa' },
                { name: 'no uppercase', new_password: 'abcdef1!gh' },
                { name: 'no lowercase', new_password: 'ABCDEF1!GH' },
                { name: 'no digit', new_password: 'Abcdefg!hi' },
                { name: 'no symbol', new_password: 'Abcdefg1hi' }
            ]
            for (const data of weakPasswords) {
                test(`TC-012 : Reject Password with ${data.name} : ${data.new_password}`, async () => {
                    await change_with_multiple_Invalid_Pwd(old_pwd_01, data.new_password, data.new_password)

                    //  await util.waitfortimeOut()

                    await console.log(`TC-012 with ${data.name}: Succesfully tested`)
                })
            }
        })
    })
    test.describe('Change password - valid + state transition', async () => {

        test.describe.configure({ mode: 'serial' })
        test.use({ storageState: 'auth.password_user.json' })

        let old_pwd_02: string;      // Tim2026@15       tim.roswell_2011_001_@example.com
        const new_pwd_02 = 'N3w!Passw0rd#2026_01'
        const confirm_pwd_02 = 'N3w!Passw0rd#2026_01'

        test.beforeAll(async () => {
            old_pwd_02 = userData_pwdTests.password;
        });

        test('TC-013 : Valid Password accepted & user is logged out', async ({ page }) => {

            await openProfile_page(page)  // login once with original credentials,
            //  then credentials are changed for testing

            await expect(pom.profile.change_password_btn).toBeEnabled()
            await pom.profile.fill_PasswordChange(old_pwd_02, new_pwd_02, confirm_pwd_02)
            // await pom.profile.changePwd_Btn_click()

            await expect(pom.profile.profile_pwd_Success_loc).toBeVisible()
            await console.log(await pom.profile.profile_pwd_Success_loc.textContent())
            await pom.login.expect_LoggedOut()
            //   await page.goto('/account/profile')     // session expired & ur thrown to login pafe
            //  await expect(page).toHaveURL(/\/auth\/login/)

            await console.log('TC-013 : Succesfully tested')
        })
        test('TC-014 : Old password fails & logs in with New Password', async () => {

            await pom.login.goto_Login()
            await pom.login.login_cred(userData_pwdTests.email, old_pwd_02)
            await expect(pom.login.login_error_msg).toBeVisible()
            await console.log(await pom.login.login_error_msg.textContent());

            await pom.login.login_cred(userData_pwdTests.email, new_pwd_02)
            await pom.login.expect_LoggedIn()
            await console.log('TC-014 : Succesfully tested')
        })
        test('TC-015 : Restore original Password', async () => {     // sometimes change_Password button works & not

            await pom.login.goto_Login()
            await pom.login.login_cred(userData_pwdTests.email, new_pwd_02)
            await pom.home.profile_loc.click()
            await pom.profile.fill_PasswordChange(new_pwd_02, old_pwd_02, old_pwd_02)

            await pom.profile.changePwd_Btn_click()

            await expect(pom.profile.profile_pwd_Success_loc).toBeVisible()
            await pom.login.expect_LoggedOut()

            await console.log('TC-015 : Succesfully tested')
        })

        // State transition: logged in -> password changed -> logged out ->
        //  logged in with new password
    })


})
