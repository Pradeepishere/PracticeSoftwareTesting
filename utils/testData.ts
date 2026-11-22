import type { APIRequestContext } from '@playwright/test';
import { promises as fs } from 'node:fs';


export interface userData_intf {
    firstName: string;
    lastName: string;
    dob: string;
    country: string;
    postalCode: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    password: string;
}
export function dynamic_buildUser_Data(overrides: Partial<userData_intf> = {}): userData_intf {
    return {
        ...validRegistration_Data,      // copies the properties of default object into new object
        ...overrides,       // replaces the property if we want to change , see below ex.
        email: overrides.email ?? uniqueEmail()
        // ?? if left side is is NOT NULL or UNDEFINED -> returns LEFT side Value
        // if left side is is NULL or UNDEFINED -> returns RIGHT side Value
        // if we provide email in runtime then use that ,
        // otherwise use uniqueEmail() to create email
    };
    // overrides -> Parameter name,  userData -> Interface containing all fields
    // Partial<userData> -> makes every Property Optional for Override Parameter
    // ex-> we can change any property of interface , like city = Mumbai
    //  dynamically_buildUser_Data ( {city: 'Mumbai'} ) ;
}

export const validRegistration_Data: userData_intf =
// this data will sent to register.spec.ts as parameter
// this parameter will go in RegisterPage -> 
// fillForm(data: userData) as in register.spec.ts (data: valodRegistration_Data )
{
    firstName: 'Tom',
    lastName: 'Jerry',
    dob: '2005-10-07',  //  dob : dobForAge(20)     -> dynamically
    country: 'Antarctica',
    postalCode: '672',
    houseNumber: 'A-1',
    street: 'Chowl_1',
    city: 'New_York',
    state: 'Alaska',
    phone: '0123456789',
    email: 'tom.jerry2026_01_@example.com', // email: uniqueEmail()     -> dynamically
    password: 'Tom@jerry#2026'

}

export interface profileData {       // optional property
    firstName?: string;
    lastName?: string;
    phone?: string;
    street?: string;
    postalCode?: string;
    city?: string;
    state?: string;
}
export const UpDate_profileData: profileData = {
    firstName: 'Tom_987',
    lastName: 'Jerry_987',
    phone: '9876543210',
    street: 'MG Road',
    postalCode: '987',
    city: 'New Delhi',
    state: 'Delhi'
}

export const LIMITS = {
    firstName: 50,
    lastName: 20,
    city: 40,
    email: 254,
};

export interface UserData_intf_API {
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email: string;
    password: string;
    address: {
        street: string;
        house_number: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    };
}
export function dynamic_API_UserData(overrides: Partial<UserData_intf_API> = {}): UserData_intf_API {
    return {
        ...Api_data,      // copies the properties of default object into new object
        ...overrides,       // replaces the property if we want to change , see below ex.
        //   email: overrides.email ?? uniqueEmail()
    };
}
export const Api_data: UserData_intf_API =
{
    first_name: 'John',
    last_name: 'Mox',
    dob: '1990-10-20',
    phone: '0987654321',
    email: 'john.mox_1990@email.com',
    password: 'John_Moxley#_@2026',
    address: {
        street: 'Avenue_01',
        house_number: 'S-15',
        city: 'New York',
        state: 'Alaska',
        country: 'Antarctica',
        postal_code: '1001',
    }
}

export function uniqueEmail(): string {     // returns Unique email -
    return `User.${Date.now()}@email.com`;   // tom.1791554520000@email.com
}

// export function uniqueEmail(prefix = 'qa.user'): string {
//   const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
//   return `${prefix}.${stamp}@example.com`;
// }

export function dobForAge(age: number, dayOffset: number = 0): string {
    const dob = new Date();

    dob.setFullYear(dob.getFullYear() - age);
    // dob.getFullYear() = 2026  , age = 18 , 	2026 - 18 = 2008 ,	10 October 2008
    dob.setDate(dob.getDate() - dayOffset);
    // dob.getDate() = todays day like 10 ,		dayoffset - we paas as parameter = 1 ,	 
    //	setDate = 10 -1  = 9 , 	we get the date - 9 october 2008

    return dob.toISOString().split('T')[0];		//	ISO - Imternational standard
    // '2006-10-09T10:30:00' ,  T → separator between date and time
    //  T → separator between date and time
    //  [0] = "2006-10-09", We get this 
    // 2006-10-09
}


export function getAgeYearsAndRemainingDays(dobString: string): string {

    const dob = new Date(dobString); // Convert DOB string into a Date object
    const today = new Date();        // Get today's date and time

    // Calculate the difference between the current year and birth year
    let years = today.getFullYear() - dob.getFullYear();    // (2026 − 2008) = 18

    // Calculate the birthday date in the current year
    const lastBirthday = new Date(dob);
    lastBirthday.setFullYear(dob.getFullYear() + years);    // 2008 + 18 = 2026

    // If this year's birthday has not arrived yet,
    // subtract 1 from the calculated age
    if (lastBirthday > today) {
        years--;

        // Move the birthday date back by one year
        lastBirthday.setFullYear(lastBirthday.getFullYear() - 1);
    }

    // Calculate the difference between today and the last birthday in milliseconds,
    // then convert milliseconds into days
    const remainingDays = Math.floor(
        (today.getTime() - lastBirthday.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Return the age as a readable string
    return `${years} years ${remainingDays} days`;
}

export type Credentials = {
    email: string;
    password: string
}
export async function getProfile_credfrom_Json() {
    const prof_Data = JSON.parse(await fs.readFile('.auth/Profile_Credentials.json', 'utf-8')) as Credentials;
    return dynamic_API_UserData({ email: prof_Data.email, password: prof_Data.password })
    //email & password stored in JSON from auth.setup.ts
    // here we read JSON & store in prof_Data, of dynamic_API_UserData({email, password})
}
export async function getPwd_credfrom_Json() {
    const pwd_Data = JSON.parse(await fs.readFile('.auth/Password_Credentials.json', 'utf-8')) as Credentials;
    return dynamic_API_UserData({ email: pwd_Data.email, password: pwd_Data.password })
    // used for Password change testing, 
}
export async function getlogin_userData() {
    const loginData = JSON.parse(await fs.readFile('.auth/login_user.json', 'utf-8')) as Credentials;
    return dynamic_buildUser_Data({ email: loginData.email, password: loginData.password })
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// export function getDobForAge(age: number, dayoffset: number): string {
//     const today = new Date();

//     const dob = new Date(
//         today.getFullYear() - age,
//         today.getMonth(),
//         today.getDate() - dayoffset 
//     );

// return dob.toISOString().split('T')[0];
// }            // today date =>>   11 oct 2026  or  2026-10-11
//  getDobForAge(32 , 1)    // 32 years & 1 day         //  1994-10-10
//  getDobForAge(32)        // 32 years exactly
//  getDobForAge(32, -1)    // 31 yeasr & 364 days      //  1994-10-12
//                  => turning 32 years until 1 day remaining





export async function createUserViaApi(
    request: APIRequestContext,
    user: userData_intf
) {
    const API_URL = 'https://api.practicesoftwaretesting.com'
    return await request.post(`${API_URL}/auth/register`, {
        data: user
    });
}





