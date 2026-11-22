import { Page, Locator, expect } from '@playwright/test';


export class ProductDetailsPage {

    readonly page: Page;
    readonly addToFavorites: Locator;
    readonly productName: Locator;
    readonly unAuthorized_add: Locator;
    readonly successfully_added_msg: Locator;
    readonly already_inFavorites_msg: Locator;
    readonly increase_qty: Locator;
    readonly decrease_qty: Locator;
    readonly quantity: Locator;


    constructor(page: Page) {
        this.page = page;
        this.addToFavorites = page.locator('#btn-add-to-favorites');
        this.productName = page.locator('[data-test="product-name"]');
        this.unAuthorized_add = page.getByText('Unauthorized', { exact: false }); // partial text match
        this.successfully_added_msg = page.getByRole('alert', { name: /Product added/ })
        this.already_inFavorites_msg = page.getByRole('alert', { name: 'Product already in your favorites list.' })
        this.increase_qty = page.getByLabel('Increase quantity')
        this.decrease_qty = page.locator('#btn-decrease-quantity')
        this.quantity = page.getByLabel('Quantity')

    }
    async goto_productsPage(productId: string) {
        await this.page.goto(`/product/${productId}`)
    }
    async expected_pageLoaded() {
        await expect(this.productName).toBeVisible()
        await expect(this.addToFavorites).toBeVisible()
    }
    async expected_alreadyIn_favLists() {
        await expect(this.already_inFavorites_msg).toBeVisible()
        console.log('Product Already Exists Msg  :  ', await this.already_inFavorites_msg.textContent());

    }
    get alert(): Locator {
        return this.page.locator
            ('[data-test="alert-error"], [data-test="alert-success"], .alert');
    }

}