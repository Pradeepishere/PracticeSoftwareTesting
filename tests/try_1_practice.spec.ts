import { test, expect, APIRequestContext } from '@playwright/test';
import { uniqueEmail, UserData_intf_API, validRegistration_Data, Api_data, dynamic_buildUser_Data, dynamic_API_UserData } from '../utils/testData';
import { UserApi } from '../utils/userApi';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { helper } from '../utils/helper';
import { RegisterPage } from '../pages/RegisterPage';

// let request: APIRequestContext;
// test('Create new user through API', async ({ request }) => {

//     const user_Email = uniqueEmail()
//     console.log(user_Email);

//     // 1. Create UserApi instance
//     const user_api = new UserApi(request);
//     const user: UserData_intf_API = dynamic_API_UserData({ email: user_Email })
//     //  Api_data

//     // 3. Create a new user through API
//     const response_Body = await user_api.createUser(user);
//     console.log(response_Body.email);

//     //console.log('Response Body:', JSON.stringify(response_Body, null, 2));
//     console.log(' Email of Profile test through API : ', response_Body.email);

// });



let profile: ProfilePage;
let login: LoginPage;
let util: helper;
let home: HomePage;
const userData = dynamic_buildUser_Data(
    { email: 'rahul.sharma2026_15_@example.com', password: 'Rahul2026@6' })

// test.skip('TC-001 : Only Register ', async ({ page }) => {

//     const register = new RegisterPage(page)
//     await register.goto_Register()

//     await register.fillForm(validRegistration_Data)
//     await register.click_Register_btn()
//     await register.expect_Registeration_Success()

// })

// test.skip('TC-002 : 2nd Account User Register ', async ({ page }) => {

//     const register = new RegisterPage(page)
//     await register.goto_Register()

//     await register.fillForm(userData)
//     await register.click_Register_btn()
//     await register.expect_Registeration_Success()

// })






// test.skip('TC-003 : Reset Profile update in Profile.spec.ts', async ({ page }) => {

//     login = new LoginPage(page)
//     home = new HomePage(page)
//     profile = new ProfilePage(page)

//     await login.goto_Login()
//     console.log(userData.email, userData.password)

//     await login.login_cred(userData.email, userData.password)
//     await home.profile_loc.click()
//     await expect(profile.profile_text).toBeVisible()
//     await expect(page).toHaveURL(/\/account\/profile/)

//     await expect(profile.firstName).toHaveValue('Tom987')
//     await profile.fillProfile_change(userData)
//     await page.waitForTimeout(2000)
//     await profile.update_Profile_btn.click()

//     await page.reload()
//     await page.waitForTimeout(5000)


// })