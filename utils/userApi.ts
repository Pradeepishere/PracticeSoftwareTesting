
import { APIRequestContext, expect, request } from '@playwright/test';
import { UserData_intf_API, LoginResponse } from '../utils/testData';
import fs from 'fs';


export class UserApi {

    constructor(private request: APIRequestContext) { }

    async createUser(user: UserData_intf_API) {
        const response = await this.request.post(
            'https://api.practicesoftwaretesting.com/users/register',
            {
                //  headers: { 'Content-Type': 'application/json' },
                data: user
            }
        );
        expect(response.status()).toBe(201);    // Verify user creation
        const resp_Body = await response.text();    // console.log('Response Body:', resp_Body);

        expect(response.ok(),
            `User registration failed: ${response.status()} ${await response.text()}`
        ).toBeTruthy();

        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();

        expect(responseBody.email).toBe(user.email);        // Verify the created user's details
        expect(responseBody.first_name).toBe(user.first_name);
        expect(responseBody.address.street).toBe(user.address.street);
        //   await console.log('Status Text, Status, Email :', response.statusText(), response.status(), responseBody.email);
        return responseBody;
        // return response;
    }

    async loginUser_getToken(user: Pick<UserData_intf_API, 'email' | 'password'>)
        : Promise<LoginResponse> {               //  (user: UserData_intf_API) {

        let access_token;
        const response = await this.request.post(
            'https://api.practicesoftwaretesting.com/users/login', {
            data: {
                email: user.email,
                password: user.password,
            },
        });

        expect(
            response.status(),
            `Login failed: ${await response.text()}`
        ).toBe(200);

        const responseBody: LoginResponse = await response.json();

        expect(responseBody.access_token).toBeTruthy();

        return responseBody;
        // const APIcontext = await request.newContext({
        //     baseURL: process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com'
        // })
        // try {
        //     const response = await APIcontext.post(
        //         'users/login',
        //         {
        //             data: {
        //                 headers: { 'Content_Type': 'application/json' },    // not necessary
        //                 email: user.email, password: user.password
        //             }
        //         }
        //     )


        //         await expect(response.status()).toBe(200)
        //         const responseBody = await response.json()
        //         // const { access_token } = await response.json();
        //         access_token = await responseBody.access_token
        //         // Create .auth folder if it does not exist.
        //         await fs.promises.mkdir('.auth', { recursive: true })
        //         fs.writeFileSync('.auth/api-token.json', JSON.stringify({ access_token }))
        //         // Save the token in a JSON file.
        //     }
        //         finally {
        //     await APIcontext.dispose();
        // }
        // return access_token
        // console.log('Access Token : ', access_Token);  // .access_token
        // return responseBody;


    }
    async get(path: string) {
        return await this.request.get(path);
    }

}



