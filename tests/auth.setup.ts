import { test as setup, expect } from '@playwright/test'
import { dynamic_buildUser_Data, dynamic_API_UserData, UserData_intf_API, LoginResponse, uniqueEmail } from '../utils/testData';
import { helper } from '../utils/helper';
import { promises as fs } from 'node:fs';
import { UserApi } from '../utils/userApi';
import { PageObjectManager } from '../pages/PageObjectManager';


const profile_AuthFile = 'auth.profil_user.json'
const password_AuthFile = 'auth.password_user.json'
const loginData_AuthFile = 'auth.login_userData.json'

const profile_cred_json = '.auth/Profile_Credentials.json'; // .auth or test-data
const password_cred_json = '.auth/Password_Credentials.json';
const login_cred_json = '.auth/login_user.json';

let util: helper;
let user_api: UserApi;
let request_Body_Profile;
let request_Body_Pwd;

// const userData = dynamic_buildUser_Data(
//     { email: 'rahul.sharma2026_0_@example.com', password: 'Rahul2026@1' })
// const userData_pwdTests = dynamic_buildUser_Data(
//     {
//         firstName: 'Tim', lastName: 'Roswell',
//         email: 'tim.roswell_2011_0_@example.com', password: 'Tim2026@1'
//     })


setup(' Profile-user authenticate', async ({ page, request }) => {
    util = new helper(page);
    user_api = new UserApi(request)
    const profile_credentials = await util.generate_Email_Pwd() // Rahul Sharma , pwd = pass

    await fs.mkdir('.auth', { recursive: true });       // mkdir('test-data',.....)
    await fs.writeFile(profile_cred_json, JSON.stringify(profile_credentials, null, 2), 'utf-8')

    const userData: UserData_intf_API = dynamic_API_UserData({     // register throhj API
        email: profile_credentials.email,
        password: profile_credentials.password
    })
    request_Body_Profile = await user_api.createUser(userData)

    // const userData = dynamic_buildUser_Data({    // register through UI, visual
    //     email: profile_credentials.email,
    //     password: profile_credentials.password
    // })
    // await util.re_register(page, userData)

    // const token = await user_api.loginUser_getToken(userData)    // token from API
    // console.log('token = ', token);

    await page.goto('/auth/login')
    await page.getByLabel('Email address *').fill(userData.email)
    await page.getByPlaceholder('Your password').fill(userData.password)
    await page.locator('.btnSubmit').click()
    await expect(page).toHaveURL(/\/account/)
    //    console.log('1 st -> Profile  Login StorageState Setup is completed');

    await page.context().storageState({ path: profile_AuthFile })
})
setup(' Password-user authenticate', async ({ page, request }) => {

    util = new helper(page);
    user_api = new UserApi(request)
    const pwd_credentials = await util.generate_Email_Pwd()

    await fs.mkdir('test-data', { recursive: true });
    await fs.writeFile(password_cred_json, JSON.stringify(pwd_credentials, null, 2), 'utf-8')

    const userData_pwdTests = dynamic_API_UserData({
        email: pwd_credentials.email,
        password: pwd_credentials.password
    })
    request_Body_Pwd = await user_api.createUser(userData_pwdTests)

    await page.goto('/auth/login')
    await page.getByLabel('Email address *').fill(userData_pwdTests.email)
    await page.getByPlaceholder('Your password').fill(userData_pwdTests.password)
    await page.locator('.btnSubmit').click()
    await expect(page).toHaveURL(/\/account/)
    //    console.log('2 nd -> Password  Login StorageState Setup is completed ');

    await page.context().storageState({ path: password_AuthFile })

})

setup('Register and Login user', async ({ page, request }) => {

    const login_user = dynamic_buildUser_Data({         // Generate user
        firstName: 'Monk'
    });
    const { email, password } = login_user;
    const login_credentials = {
        email, password
    };
    await fs.mkdir('.auth', { recursive: true });           // Create directory if it doesn't exist
    await fs.writeFile(login_cred_json, JSON.stringify(login_credentials, null, 2), 'utf-8')

    const pom = new PageObjectManager(page, request);

    await pom.register.goto_Register();
    await pom.register.fillForm(login_user);
    await pom.register.click_Register_btn();
    await pom.register.expect_Registeration_Success();

    await pom.login.login_cred(login_user.email, login_user.password);
    await pom.login.expect_LoggedIn();

    await page.context().storageState({ path: loginData_AuthFile });        // Save authentication state

    // console.log('Registration and Login completed successfully');
});
