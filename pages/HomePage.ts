import { Page, Locator, expect } from '@playwright/test';
import { userData_intf } from '../utils/testData';


export class HomePage {

    readonly page: Page;
    readonly homeIcon: Locator;
    readonly userName: Locator;
    readonly MyProfile: Locator;
    readonly profile_loc: Locator;
    readonly allProd_inPage: Locator;
    readonly allProd_Name: Locator;
    readonly allProdIn_oneContainer: Locator;
    readonly favorites: Locator;
    readonly search_qyery: Locator;
    readonly search_btn: Locator;
    readonly product_found: Locator;
    readonly searched_msg: Locator;
    readonly searched_allProd_InOne: Locator;


    constructor(page: Page) {

        this.page = page;
        this.homeIcon = page.getByRole('link', { name: 'Home' })
        this.userName = page.locator('#menu')
        this.MyProfile = page.getByRole('link', { name: 'My profile' })
        this.profile_loc = page.getByRole('link', { name: "Profile" })

        this.allProdIn_oneContainer = page.locator('.row .container')
        this.allProd_inPage = page.locator('.card');
        this.allProd_Name = page.locator('.card-title')     // getByTestId('product-name')
        // page.getByTestId
        this.favorites = page.getByRole('link', { name: 'Favorites' })
        this.search_qyery = page.locator('#search-query')
        this.search_btn = page.getByRole('button', { name: 'Search' })
        this.product_found = page.getByTestId('search-result-count')
        this.searched_msg = page.locator('[data-test="search-caption"]')        // Searched for : 
        this.searched_allProd_InOne = page.locator('[data-test="search_completed"]')
    }
    async goto_home() {
        await this.page.goto('')
        await expect(this.page).toHaveURL('https://practicesoftwaretesting.com/')
        await expect(this.allProd_Name.last()).toBeVisible()
    }
    async expect_UserName(userdata: userData_intf) {
        const expected_UserName = `${userdata.firstName} ${userdata.lastName}`;
        await expect(this.userName).toHaveText(expected_UserName)
        // console.log(await this.userName.textContent());
    }
    async expect_homeIcon() {
        await expect(this.homeIcon).toBeVisible()
    }
    async join_first_last_Name(firstName: string, lastName: string) {
        return `${firstName} ${lastName}`
    }
    async foundProd_Count() {
        const prodText = await this.product_found.innerText()
        const count = Number(prodText.trim().split(' ')[0])
        return count;
    }

    // -----------************   PRODUCTS    *************--------------------

    async open_Products(prod_Name: string) {
        const product = this.page.getByText(prod_Name, { exact: true });
        // const product = await this.allProd_Name.filter({ hasText: prod_Name }).first();
        //   console.log('prod Name : ', await product.textContent());
        await expect(product).toBeVisible({ timeout: 20000 });
        await product.click();      // opens a productDetails Page
        await expect(this.page).toHaveURL(/\/product\//);       // page is in products Detail page url
    }

    async anyProd_visible() {
        // console.log('Total Product in Page : ', await this.allProd_Name.count());
        await expect(this.allProd_Name.filter({ hasText: 'Pliers' }).first()).toBeVisible()
    }

    async timeout() {
        await this.page.waitForTimeout(2000)
    }

}