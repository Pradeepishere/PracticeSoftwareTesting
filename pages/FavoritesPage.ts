import { Page, Locator, expect } from '@playwright/test';

export class FavoritesPage {

    readonly page: Page;
    readonly many_Prod_Names: Locator;
    readonly many_Products_loc: Locator;
    readonly remove_btn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.many_Prod_Names = page.locator('.card-title');   // getByTestId('product-name')
        this.many_Products_loc = page.locator('.card')
        this.remove_btn = page.locator('.btn-danger')
    }
    async goto_favorites() {
        await this.page.goto('/account/favorites')
        await this.expect_favoritesPage()
        // await expect(this.many_Prod_Names.first().or(this.noFavorite_PresentMsg)).toBeVisible()    
        //  locators, either Prod is present or No prod is added to favorite
    }
    async expect_favoritesPage() {
        await expect(this.page).toHaveURL(/\/account\/favorites/)
    }
    singleProduct_loc(prod_Name: string) {    // gives Locator
        return this.page.locator('.card', {             // same as get_singleProduct, see below method
            has: this.page.getByTestId('product-name')
                .filter({ hasText: prod_Name })
        })
    }
    async get_singleProduct(pordName: string) {     // same as singleProduct_loc, see above method
        return this.page.locator('.card').filter({ hasText: pordName })
    }
    async get_allNames() {   // : Promise<string[]>               //  return all Names present in Fav. page
        return (await this.many_Prod_Names.allInnerTexts()).map((s) => s.trim())
    }
    async expect_AllProd_In_Fav(allProd: string[]) {        // allProd => all product to be added in fav.

        await expect(this.many_Prod_Names).toHaveCount(allProd.length)
        const actualProd_InFav = await this.get_allNames()      // actual prod already in Fav. page
        await expect(actualProd_InFav.sort()).toEqual([...allProd].sort())      // ...allProd -> creates a copy
        console.log('All products : ', actualProd_InFav, ' , Count : ', await this.many_Products_loc.count());
    }

    get noFavorite_PresentMsg(): Locator {
        return this.page.getByText('There are no favorites yet.', { exact: false })
        // {exact: false} => means partial text 
    }
    async remove(prodName: string) {    // inside Single Product locator , find remove btn
        await expect(this.remove_btn.first()).toBeVisible({ timeout: 10000 })
        await (await this.get_singleProduct(prodName)).locator('.btn-danger').click()
    }
    async expect_ContainsProd(prodName: string) {   // given Product is present in favorite page list
        await expect(this.many_Prod_Names.filter({ hasText: prodName })).toHaveCount(1)
    }
    async expect_Not_ContainsProd(prodName: string) {       // for 1 product Not present in Favorites lists
        await expect(await this.get_singleProduct(prodName)).toBeHidden()
        await expect(this.many_Prod_Names.filter({ hasText: prodName })).toHaveCount(0)
    }
    async expect_emptyFavorites() {     // No product is present in Favorites page lists
        await expect(this.noFavorite_PresentMsg).toBeVisible({ timeout: 10000 })
        await expect(this.many_Prod_Names).toHaveCount(0)
    }
    async expect_anyProd_inFav() {       // atleast Any 1 or more Products are present
        await expect(await this.remove_btn.first()).toBeVisible({ timeout: 10000 })
        await expect(await this.many_Prod_Names.first()).toBeVisible()
        await expect(this.noFavorite_PresentMsg).not.toBeVisible()
        await expect(this.noFavorite_PresentMsg).toBeHidden()
    }
    async count_Product_inFav() {
        console.log('Total Prod : ', await this.many_Prod_Names.count());

    }
    async clearAll() {
        let currentCount = await this.many_Products_loc.count();
        while (currentCount > 0) {
            await this.many_Products_loc.first().locator('.btn-danger').click();
            currentCount -= 1;
            await expect(this.many_Products_loc).toHaveCount(currentCount);
            console.log('Current Count : ', currentCount);
        }
        await expect(this.noFavorite_PresentMsg).toBeVisible();
        console.log(await this.noFavorite_PresentMsg.textContent());
    }



}