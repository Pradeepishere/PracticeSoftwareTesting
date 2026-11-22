import { Page, APIRequestContext } from '@playwright/test';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ProfilePage } from './ProfilePage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { helper } from '../utils/helper';
import { UserApi } from '../utils/userApi';
import { FavoritesPage } from '../pages/FavoritesPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

export class PageObjectManager {

    readonly page: Page;
    readonly request: APIRequestContext;

    private _home?: HomePage;
    private _login?: LoginPage;
    private _register?: RegisterPage;
    private _profile?: ProfilePage;
    private _forgot_password?: ForgotPasswordPage;
    private _util?: helper;
    private _userApi?: UserApi;
    private _favorites?: FavoritesPage;
    private _product_detail?: ProductDetailsPage;

    constructor(page: Page, request: APIRequestContext) {
        this.page = page;
        this.request = request;
    }

    get home(): HomePage {
        return this._home ??= new HomePage(this.page);
    }
    get login(): LoginPage {
        return this._login ??= new LoginPage(this.page);
    }
    get register(): RegisterPage {
        return this._register ??= new RegisterPage(this.page);
    }
    get profile(): ProfilePage {
        return this._profile ??= new ProfilePage(this.page);
    }
    get forgot_pwd(): ForgotPasswordPage {
        return this._forgot_password ??= new ForgotPasswordPage(this.page);
    }
    get util(): helper {
        return this._util ??= new helper(this.page);
    }
    get userApi(): UserApi {
        return this._userApi ??= new UserApi(this.request);
    }
    get favorites(): FavoritesPage {
        return this._favorites ??= new FavoritesPage(this.page);
    }
    get productDetails(): ProductDetailsPage {
        return this._product_detail ??= new ProductDetailsPage(this.page)
    }

}