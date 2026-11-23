import { Page, Browser } from '@playwright/test';
import { getProfile_credfrom_Json, getPwd_credfrom_Json, UserData_intf_API, dynamic_buildUser_Data, uniqueEmail } from '../utils/testData';
import { PageObjectManager } from '../pages/PageObjectManager';
import { FavoritesPage } from '../pages/FavoritesPage';
import { HomePage } from '../pages/HomePage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { RegisterPage } from '../pages/RegisterPage';
import { test, expect } from '../fixtures/login.fixture';


test.describe('Product testing in Favorites Page', () => {

    let pom: PageObjectManager;

    let userDataProfile: UserData_intf_API;
    let userDataPwdTests: UserData_intf_API;
    let fav: FavoritesPage;
    let hom: HomePage;
    let prod_deta: ProductDetailsPage;
    let reg: RegisterPage;

    const Prod_A = 'Combination Pliers';
    const Prod_B = 'Bolt Cutters';
    const Prod_C = 'Slip Joint Pliers';
    const Prod_D = 'Thor Hammer';
    const Prod_E = 'Claw Hammer with Shock Reduction Grip';
    const Prod_F = 'Hammer';

    let Email_profile: string;
    let Pwd_profile: string;

    test.beforeAll(async () => {
        userDataProfile = await getProfile_credfrom_Json()
        userDataPwdTests = await getPwd_credfrom_Json()

        Email_profile = process.env.FAV_EMAIL ?? userDataProfile.email;       // use of dotenv, for env
        Pwd_profile = process.env.FAV_PASSWORD ?? userDataProfile.password;

        // const Email_pwdTests = process.env.FAV_EMAIL ?? userDataPwdTests.email;
        // const Pwd_pwdTests = process.env.FAV_PASSWORD ?? userDataPwdTests.password;
    })
    test.beforeEach(async ({ page, request }) => {
        pom = new PageObjectManager(page, request)
        fav = pom.favorites;
        hom = pom.home;
        prod_deta = pom.productDetails;
        reg = pom.register;
    })
    async function addProd_InFav(product: string) {
        await pom.home.goto_home()
        await pom.home.anyProd_visible()    //  console.log(await pom.home.allProd_Name.allInnerTexts());
        await pom.home.open_Products(product)       // prod detail page opened
        await pom.productDetails.expected_pageLoaded()
        await pom.productDetails.addToFavorites.click()
        await expect(pom.productDetails.successfully_added_msg).toBeVisible({ timeout: 5000 })
        await pom.favorites.goto_favorites()
        await fav.expect_anyProd_inFav()
    }
    async function removeProduct(product: string) {
        await fav.remove(product)
        await fav.expect_Not_ContainsProd(product)
    }

    test.describe('Favorites page requires login', async () => {

        test('TC-01-Fav : Favorites page requires Login', async ({ browser }) => {
            const ctxt = await browser.newContext({
                storageState: { cookies: [], origins: [], }         // fresh New Page
            })
            const newPage = await ctxt.newPage()
            try {
                await newPage.goto('/account/favorites')
                await newPage.waitForTimeout(4000)
                await expect(newPage.getByLabel('Email address *')).toBeVisible({ timeout: 20000 })
                await expect(newPage).toHaveURL(/\/auth\/login/)
            }
            finally {
                await ctxt.close()
            }
            console.log('Success - 01 ');
        })
        test('TC-02-Fav : Empty Favorites list shows empty state', async ({ page, pom, loggedInUser }) => {

            await page.goto('/')
            await pom.favorites.goto_favorites()
            await pom.favorites.expect_emptyFavorites()
            console.log('Success - 02 ');
        })
    })
    // State transition ( Adding ): Not Favorite -> Favorite

    test.describe('Favorites Adding Products - State transition', async () => {

        test.use({              // remove storage state for this describe tests
            storageState: { cookies: [], origins: [] },
        });
        test.describe.configure({ mode: 'serial' })
        let pom: PageObjectManager;

        test.beforeEach(async ({ page, request }) => {
            pom = new PageObjectManager(page, request);
            const user = dynamic_buildUser_Data({ email: uniqueEmail() });

            await pom.register.goto_Register();
            await pom.register.fillForm(user);
            await pom.register.click_Register_btn();
            await pom.register.expect_Registeration_Success();

            await pom.login.login_cred(user.email, user.password);
            await pom.login.expect_LoggedIn();
        });

        test('TC-03 Fav : Add 1 product in Empty Fav. list -> appears in Favorites list page', async () => {

            await pom.favorites.goto_favorites()
            await pom.favorites.expect_emptyFavorites()
            await addProd_InFav(Prod_A)
            await pom.favorites.expect_ContainsProd(Prod_A)
            //                      await pom.util.waitfortimeOut()
            console.log('Success - 03 ')
            await removeProduct(Prod_A)        // Removing Now Prod_A product
        })

        test('TC-04 Fav : Add multiple products, appear in Favorite Page', async () => {

            await pom.favorites.goto_favorites()
            await pom.favorites.expect_emptyFavorites()
            await addProd_InFav(Prod_B)
            await addProd_InFav(Prod_E)

            await pom.favorites.expect_anyProd_inFav()
            // console.log('All products added : ', await pom.favorites.many_Prod_Names.allTextContents());
            console.log('All products in Fav Page : ', await pom.favorites.get_allNames());
            // ([Prod_A, Prod_B, Prod_C]))  // if Prod_A is not removed from favoritews page lists
            await pom.favorites.expect_AllProd_In_Fav([Prod_B, Prod_E])

            console.log('Success - 04 ')
            await removeProduct(Prod_B)
            await removeProduct(Prod_E)

        })
        test('TC-05-Fav : Add same product twice -> shows no duplicate entry', async () => {

            await addProd_InFav(Prod_D)       // Added Once prod_D
            await pom.home.goto_home()
            await pom.home.anyProd_visible()
            await pom.home.open_Products(Prod_D)       // adding 2n time same product
            await pom.productDetails.expected_pageLoaded()
            await pom.productDetails.addToFavorites.click()         // shows already in Favorite lists
            await pom.productDetails.expected_alreadyIn_favLists()

            console.log('Success - 05 ')
            await fav.goto_favorites()
            await removeProduct(Prod_D)
        })
    })

    //    State transition: Favorite -> Not Favorite
    test.describe('Removing from Favorites List Page', async () => {

        test.describe.configure({ mode: 'serial' })

        test('TC-06-Fav : Remove 1 product -> is No longer in Favorites page', async () => {

            await addProd_InFav(Prod_D)     // adding to Favorites lists
            console.log(await (await fav.get_singleProduct(Prod_D)).locator('.card-title').textContent());
            await (await fav.get_singleProduct(Prod_D)).locator('.btn-danger').click()
            await fav.expect_Not_ContainsProd(Prod_D)

            console.log('Success - 06 ')
        })
        test('TC-07-Fav : Remove all products -> shows Empty Favorites list', async ({ page, pom, loggedInUser }) => {

            await addProd_InFav(Prod_A)
            await addProd_InFav(Prod_B)
            await addProd_InFav(Prod_C)     //  adding to Favorites lists
            await pom.favorites.expect_AllProd_In_Fav([Prod_A, Prod_B, Prod_C])

            await pom.favorites.clearAll()        //  removing all products
            console.log('Success - 07 ')
        })
    })

    // Persistence: reload, logout / login
    test.describe('Favorites - Persistence', async () => {
        test.describe.configure({ mode: 'serial' })

        test('TC-08-Fav : Favorites remain after page reload', async ({ page }) => {
            await addProd_InFav(Prod_C)
            await addProd_InFav(Prod_D)
            await page.reload()
            await fav.expect_AllProd_In_Fav([Prod_C, Prod_D])

            console.log('Success - 08');
        })
        test('TC-09-Fav : Favorites Remain after logout & login', async () => {
            //   await addProd_InFav(Prod_A)
            //  await addProd_InFav(Prod_D)
            await fav.goto_favorites()
            await fav.expect_anyProd_inFav()
            const before_prodNames: string[] = await fav.get_allNames()
            console.log('Before LogOut -> All Product in Fav page : ', before_prodNames);

            await pom.login.logOut()
            await pom.login.login_cred(Email_profile, Pwd_profile)
            await expect(pom.home.favorites).toBeVisible()
            await pom.home.favorites.click()

            await fav.expect_anyProd_inFav()
            const after_prodNames: string[] = await fav.get_allNames()
            console.log('After LogIn -> All Product in Fav page : ', after_prodNames);
            expect(after_prodNames).toEqual(before_prodNames)

            console.log('Success - 09');

        })
        test('TC-10-Fav : Removed Favorite stays removed after logout & login', async () => {
            await addProd_InFav(Prod_A)     // product added
            await fav.remove(Prod_A)        // product removed
            await pom.login.logOut()
            await pom.login.login_cred(Email_profile, Pwd_profile)
            await pom.login.expect_LoggedIn()
            await fav.goto_favorites()
            await fav.expect_Not_ContainsProd(Prod_A)    // after logout , product not present in Fav. lists 
            await fav.expect_anyProd_inFav()

            console.log('Success - 10');
            await fav.clearAll()
        })
    })
    // Error guessing
    test.describe('Error Guessing, logged out / bad access', async () => {

        test('TC-11_Fav : WithOut login, User cannot add product in Favorite', async ({ browser }) => {

            const context = await browser.newContext({
                storageState: { cookies: [], origins: [], }
            })
            const newpage = await context.newPage();

            await newpage.goto('')
            const favo = new FavoritesPage(newpage)
            await newpage.locator('.card').filter({ hasText: Prod_B }).click()
            await newpage.locator('#btn-add-to-favorites').click()
            await expect(newpage.getByText('Unauthorized', { exact: false })).toBeVisible
            console.log(await newpage.getByText('Unauthorized', { exact: false }).textContent());

            console.log('Success - 11');
        })
        test('TC-12-Fav : Favorite page redirects to login Page after logged out', async ({ page, pom, loggedInUser }) => {

            await page.goto('/account/favorites')
            await pom.login.logOut()
            await pom.login.expect_LoggedOut()
            await pom.login.print_Url()

            console.log('Success - 12');
        })
    })
    test.describe('Available Product and UnAvailable Product', async () => {
        const valid_prod = 'Pliers'
        const inValid_prod = 'InvalidProduct'
        test('TC-13-Fav : Available / valid product is added to Favorites', async ({ page, pom, loggedInUser }) => {

            const hom = pom.home;
            const prod_deta = pom.productDetails;
            const fav = pom.favorites;
            await page.goto('/')
            await hom.search_qyery.fill(valid_prod)
            await hom.search_btn.click()
            await expect(hom.searched_msg).toBeVisible()
            console.log('Searched : ', await hom.searched_msg.textContent());
            await hom.product_found.waitFor({ state: 'visible' })
            console.log('Found Msg : ', await hom.product_found.innerText());
            await hom.timeout()
            console.log('Searched Products Available : ', await hom.allProd_Name.count())

            const prod_count = (await hom.product_found.innerText()).trim().split(' ')[0]
            console.log('Searched product Count : ', prod_count);
            await expect(await hom.allProd_Name.count()).toBe(Number(prod_count))
            await hom.allProd_Name.first().click()

            await expect(prod_deta.productName).toBeVisible()
            const selected_Prod = await prod_deta.productName.innerText()
            console.log('Selected Prod : ', selected_Prod);

            await prod_deta.addToFavorites.click()
            await expect(prod_deta.successfully_added_msg).toBeVisible()
            await fav.goto_favorites()
            await fav.expect_ContainsProd(selected_Prod)

            console.log('Success - 13');
        })
        test('TC-14-Fav : In-valid product is not displayed in Favorites', async () => {

            await hom.goto_home()
            await hom.search_qyery.fill(inValid_prod)
            await hom.search_btn.click()
            await expect(hom.searched_msg).toBeVisible()
            const prod_count = (await hom.product_found.innerText()).trim().split(' ')[0]         // zero 0
            console.log('Searched product Count : ', prod_count);
            // await expect(home.allProd_Name).toBe(prod_count)

            console.log('Success - 14');

        })
    })






})