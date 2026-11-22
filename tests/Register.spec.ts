import { test, expect, Locator, Browser, Page } from '@playwright/test';
import { validRegistration_Data, dobForAge, dynamic_buildUser_Data, getAgeYearsAndRemainingDays, uniqueEmail } from '../utils/testData';
import { PageObjectManager } from '../pages/PageObjectManager';


const userEmail = uniqueEmail()
const user_data = dynamic_buildUser_Data({ firstName: 'Ram', lastName: 'Lakhan', email: userEmail })

test.describe('Register - Customer Account Creation', () => {   // 1st Decribe

    test.use({              // remove storage state for this describe tests
        storageState: { cookies: [], origins: [] },
    });
    let pom: PageObjectManager;

    test.beforeEach(async ({ page, request }) => {
        pom = new PageObjectManager(page, request);
        await pom.register.goto_Register()     // go to /auth/register url
    })

    test.describe('Test cases of Register Page', () => {    // describe in 1st Describe

        test.describe.configure({ mode: 'serial' });        // Optional

        test('TC-Reg-001 : Customer Register with Valid data', async ({ page }) => {

            await console.log('Unique Email : ', userEmail);

            await pom.register.fillForm(user_data)
            await pom.register.click_Register_btn()
            await expect(pom.login.login_Text).toBeVisible({ timeout: 10000 })

            const current_URL = page.url()
            if (current_URL.match(/\/auth\/login/)) {
                await expect(page.getByText('Customer registration')).not.toBeVisible() // Registration text Not to be visible
                await console.log('URL : ', current_URL);
                await pom.register.expect_Registeration_Success()
                await expect(pom.login.login_btn).toBeVisible()
            }
            else {
                await console.log('Current URL = ' + page.url());
                await console.log('Failed to Register = ' + await pom.register.formError.first().innerText());
                await expect(page.getByText('Customer registration')).toBeVisible()
            }
            console.log('  1  =======================');

        });

        test('TC-Reg-002 : Newly registered user can now Login', async ({ page }) => {

            await pom.login.goto_Login()
            await console.log('Unique Email : ', userEmail);
            await page.getByPlaceholder('Your email').fill(userEmail)
            await page.locator('#password').fill(user_data.password)
            await page.locator('.btnSubmit').click()

            await expect(page).toHaveURL(/\/account/)
            await console.log('name = ' + await page.locator('#menu').textContent());

            await expect(await page.locator('#menu')).
                toContainText(`${user_data.firstName} ${user_data.lastName}`)
            console.log('  2  =======================');

        });
    });

    test.describe('Age boundary values (18-75 inclusive)', () => {

        test.describe.configure({ mode: 'serial' });        // Optional

        const cases = [
            { label: '17 years 364 days (just under 18)', dob: () => dobForAge(18, -1), valid: false },
            { label: 'exactly 18 years (lower boundary)', dob: () => dobForAge(18, 0), valid: false },
            { label: '18 years 1 day (just over lower)', dob: () => dobForAge(18, 1), valid: true },
            { label: '74 years 364 days (just under upper)', dob: () => dobForAge(75, -1), valid: true },
            { label: 'exactly 75 years (upper boundary)', dob: () => dobForAge(75, 0), valid: true },
            { label: '75 years 364 days (last day of age 75)', dob: () => dobForAge(76, -1), valid: true },
            { label: 'exactly 100 years (just over upper)', dob: () => dobForAge(100, 0), valid: false },
        ];

        for (const c of cases) {
            test(`TC-REG-AGE: ${c.label} -> ${c.valid ? 'accepted' : 'rejected'}`, async () => {

                const user_Data = dynamic_buildUser_Data({ email: uniqueEmail(), dob: c.dob() });
                await pom.register.fillForm(user_Data);
                await pom.register.click_Register_btn()
                console.log('DOB : ', c.dob());
                console.log('Age : ', getAgeYearsAndRemainingDays(c.dob()));

                if (c.valid) {
                    await pom.register.expect_Registeration_Success()
                    await console.log('Registration succes');

                } else {
                    await pom.register.expect_Still_on_Registration()
                    await pom.register.waitFor_FormError()
                    await console.log('number of Errors = ' + await pom.register.formError.count());
                    const error_Msgs = await pom.register.formError.first().textContent()
                    await console.log('Error Msgs = ' + error_Msgs);
                    await expect(pom.register.formError.first()).toBeVisible();
                }
            });
        }

        test('TC-REG-AGE: future date of birth is rejected', async () => {  // today, year-> 2026-(-1) = 2027 future bith
            await pom.register.fillForm(dynamic_buildUser_Data({ dob: dobForAge(-1) }));
            await pom.register.click_Register_btn()
            await pom.register.expect_Still_on_Registration();
            await pom.register.waitfortimeout()
        });

        test('TC-REG-AGE: age 17 / 76 / 0 / 120 representative invalid classes (EP)', async ({ page }) => {
            for (const years of [0, 15, 100, 120]) {    // from 76 t0 99 works -> website's problem 
                await pom.register.goto_Register();
                await pom.register.fillForm(dynamic_buildUser_Data({ dob: dobForAge(years) }));
                await console.log('DOB = ' + await pom.register.dob.inputValue());
                await pom.register.click_Register_btn()

                // await register.waitfortimeout()
                const current_URL = page.url()
                if (current_URL.match(/\/auth\/login/)) {
                    await pom.register.expect_Registeration_Success()
                }
                else {
                    await console.log('Current URL = ' + page.url());
                    await pom.register.waitFor_FormError()
                    await pom.register.expect_Still_on_Registration();
                }
                // await register.waitfortimeout()
            }
        });
    });

    // 3. Email

    test.describe('Email valdations', async () => {

        test.describe.configure({ mode: 'serial' });        // Optional
        const data = dynamic_buildUser_Data({ email: uniqueEmail() })

        test('TC-Email-001 : Valid email is accepted', async () => {
            await pom.register.fillForm(data)
            await pom.register.click_Register_btn()
            await pom.register.expect_Registeration_Success()
        })

        const invalidEmails = [
            'plainaddress',
            'missing-at-sign.com',
            '@no-local-part.com',
            'user@',
            'user@@example.com',
            'user name@example.com',
            'user@exa mple.com',
            // 'user@example',
            // 'user@.com',
        ];

        for (const email of invalidEmails) {
            test(`TC-Email-002 : Invalid "${email}" is Rejected`, async () => {
                await pom.register.fillForm(dynamic_buildUser_Data({ email: email }))
                await pom.register.click_Register_btn()
                await pom.register.expect_Still_on_Registration()
                await pom.register.waitFor_FormError()
            })
        }
        test('TC-Email-003 : Already registered email is rejected', async ({ page }) => {
            await expect(page).toHaveURL(/\/auth\/register/)
            await pom.register.fillForm(data)
            await pom.register.click_Register_btn()
            await pom.register.waitFor_FormError()
        })
    })

    // 4. Mandatory fields

    test.describe('Mandatory Fields', () => {

        //   test.describe.configure({ mode: 'serial' });        // Optional

        const required_Fields = [           // key: 'firstName' -> represents in testdata of validRegdata -> firstName
            { key: 'firstName', error: 'first_name', message: /first name is required/i },  // regex, i -> case insensitive
            { key: 'email', error: 'email', message: /email is required/i },

        ] as const      // as const used -> preserves the exact values of key and error & as RewadOnly (values can't be re-assigned)

        for (const field of required_Fields) {
            test(`TC-Fields-001 : empty ${field.key} shows validation Message -> ${field.key} is required`, async () => {
                await pom.register.fillForm(dynamic_buildUser_Data({ [field.key]: '' }))
                await pom.register.click_Register_btn()
                await pom.register.expect_Still_on_Registration()
                await console.log(await pom.register.errorFor(field.error).textContent());
                await pom.register.waitfortimeout()

                await expect(pom.register.errorFor(field.error)).toBeVisible()
                await expect(pom.register.errorFor(field.error)).toContainText(field.message)
            })
        }
        test('Tc-Fields-002 : Submitting all Empty fields shows all required errors', async () => {
            await pom.register.click_Register_btn()
            await pom.register.expect_Still_on_Registration()
            await pom.register.waitfortimeout()
            const fields = [
                'first_name',
                'last_name',
                'dob',
                'postal_code',
                // 'house_number',
                'street',
                'city',
                'state',
                'country',
                'phone',
                'email',
                'password',
            ]
            for (const field of fields) {
                await expect(pom.register.errorFor(field), `Missing error for ${field}`).toBeVisible()
                await console.log(await pom.register.errorFor(field).textContent());
            }
        })
    })

    // Maximum length - BVA (max OK, max+1 fails)               // website , there is no limit for max 
    //    Set real limits in utils/testData.ts -> LIMITS

    // test.describe('Maximum length for Fields', () => {      // in this website , there is no limit for max 
    //     const fields = [                            // this tests for Max character is no longer needed
    //         { name: 'fristName', max: LIMITS.firstName },
    //         { name: 'city', max: LIMITS.city },
    //     ] as const

    //     for (const field of fields) {
    //         test(`TC-Max_Length-001 : Max character in ${field.name} should accept`, async () => {
    //             await register.fillForm(dynamic_buildUser_Data({ [field.name]: 'a'.repeat(field.max) }))
    //             // [field.name]: 'a'.repeat(field.max) => firstName : 50 character typed 'a'
    //             await register.click_Register_btn()
    //             await register.expect_Registeration_Success()
    //         })

    //         test(`TC-Max_Length-002: ${field.name} with ${field.max + 1} chars is NOT accepted`, async () => {
    //             const lastName_loc = register.lastName    // f.locator(register);
    //             await register.fillForm(dynamic_buildUser_Data({ [field.name]: 'a'.repeat(field.max + 1) }));

    //             const maxAttr = await lastName_loc.getAttribute('maxlength');
    //             if (maxAttr) {
    //                 // UI blocks extra typing -> value must be truncated to the limit
    //                 await expect(lastName_loc).toHaveValue('a'.repeat(field.max));
    //             } else {
    //                 await register.click_Register_btn()
    //                 await register.expect_Still_on_Registration()
    //             }
    //         });
    //     }

    //     test(`TC-Max_Length-003 : email of exactly ${LIMITS.email} chars is accepted`, async () => {
    //         const domain = '@example.com';
    //         const local = 'a'.repeat(LIMITS.email - domain.length - 1) + '1';
    //         // keep the local part within the RFC 64-char limit only if the app enforces it
    //         await register.fillForm(dynamic_buildUser_Data({ email: `${local}${domain}` }));
    //         // Either accepted or rejected by RFC rules; the point is , it must not crash.

    //         await expect(register.page).toHaveURL(/\/auth\/(login|register)/);
    //     });

    //     test(`TC-Max_Length-004 : email longer than ${LIMITS.email} chars is rejected`, async () => {
    //         const email = `${'a'.repeat(LIMITS.email)}@example.com`
    //         await register.fillForm(dynamic_buildUser_Data({ email }))
    //         await register.expect_Still_on_Registration()
    //     });
    // });

    // Your password must:
    //  Be at least 8 characters long
    //  Contain both uppercase and lowercase letters
    //  Include at least one number
    //  Have at least one special symbol(e.g., @, #, $, etc.)

    test.describe('Password rules testing , Valid & Invalid', () => {

        //  test.describe.configure({ mode: 'serial' });        // Optional

        const passwordCases = [
            // upper, lower, digit, special
            { tc: '001', name: 'all four classes present', passwd: 'Abcdef1!xyz', ok: true },
            { tc: '002', name: 'missing uppercase', passwd: 'abcdef1!xyz', ok: false },
            { tc: '003', name: 'missing lowercase', passwd: 'ABCDEF1!XYZ', ok: false },
            { tc: '004', name: 'missing number', passwd: 'Abcdefg!xyz', ok: false },
            { tc: '005', name: 'missing special character', passwd: 'Abcdef1xyzw', ok: false },
            { tc: '006', name: 'only lowercase', passwd: 'abcdefghijk', ok: false },
            { tc: '007', name: 'only digits', passwd: '12345678901', ok: false },
            { tc: '008', name: 'too short (5 chars, all classes)', passwd: 'Ab1!x', ok: false },
            { tc: '009', name: 'whitespace only', passwd: '           ', ok: false },
        ];

        for (const pwd of passwordCases) {
            test(`TC-Password-${pwd.tc} : ${pwd.name} is -> ${pwd.ok ? 'Accepted' : 'Rejected'}`, async () => {
                await pom.register.fillForm(dynamic_buildUser_Data({ password: pwd.passwd }))
                await pom.register.click_Register_btn()

                if (pwd.ok) {
                    await pom.register.expect_Registeration_Success()
                }
                else {
                    await pom.register.expect_Still_on_Registration()
                    await expect(pom.register.errorFor('password')).toBeVisible()
                }
            })
        }

        // 7. Other fields / security / UX
        // ---------------------------------------------------------------------
    })
    test.describe('Other validations and UX', () => {
        //   test.describe.configure({ mode: 'serial' });        // Optional

        test('TC-Phone-001 : non-numeric phone number is rejected', async () => {
            await pom.register.fillForm(dynamic_buildUser_Data({ email: uniqueEmail(), phone: 'abcdefghij' }))
            await pom.register.click_Register_btn()
            await pom.register.expect_Still_on_Registration()
            await expect(await pom.register.errorFor('phone')).toBeVisible()
            await console.log(await pom.register.errorFor('phone').textContent());

        });

        // test('TC-Pop_up/Alert-002 : Cross-Site Scripting (XSS) payload in first name is not executed', async () => {
        //     let dialogSeen = false;     // tracks JavaScript dialog appeared or not

        //     page.on('dialog', async (dialog) => {       // listens JavaScript dialogs, such as alert(), confirm() and prompt(
        //         dialogSeen = true;          // means JS dialog appeared.
        //         await dialog.dismiss();
        //     });

        //     await register.fillForm(dynamic_buildUser_Data({ firstName: '<script>alert(1)</script>' }))
        //     expect(dialogSeen).toBe(false);         // verifies that the value is falsy
        // });

        test('TC-SQL_email-003 : SQL injection string in email is rejected', async () => {

            await pom.register.fillForm(dynamic_buildUser_Data({ email: "' OR 1=1 --@example.com" }))
            await pom.register.click_Register_btn()
            await pom.register.waitfortimeout()
            await pom.register.expect_Still_on_Registration()   // email should fail & page should be on regsitration

            //  ' ->    A single quote, used to break out of a SQL string if an application constructs queries unsafely
            //  OR ->   A SQL logical operator
            //  1=1 ->  A condition that is always true
            //  --  ->  A SQL comment marker in many SQL dialects.
            //  @example.com -> An email-like suffix appended to the payload.
        });

        test('TC-UX-004 : errors disappear after the field is corrected', async () => {
            await pom.register.click_Register_btn()
            await expect(pom.register.errorFor('first_name')).toBeVisible()

            await pom.register.firstName.fill('John')
            await pom.register.click_Register_btn()
            await expect(pom.register.errorFor('first_name')).toBeHidden()
            await pom.register.waitfortimeout()
        });

        test('TC-UX-005 : register page has a link back to login', async ({ page }) => {
            await console.log(await page.url());        // on Register page

            const loginLink: Locator = page.getByRole('link', { name: 'Sign in' })   //.first()  // either login  or sign in -> available
            // const loginLink = page.getByRole('link', { name: 'Sign in' })
            await console.log('loginLink : ', await loginLink.textContent());

            await loginLink.click()     // now on Login page
            await expect(pom.login.login_btn).toBeVisible()
        });
    });






})





// 2. Age - Boundary Value Analysis (valid range 18-75 inclusive)
//    Age is derived from Date of Birth.



