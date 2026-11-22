// import { test, request } from '@playwright/test'
import { promises as fs } from "node:fs";
import { test_api as test, expect } from "../fixtures/apiFixtures";

// test.skip("login API", async ({ authedUserApi }) => {
  // login through API
  //   const res = await request.post(`${API_URL}/users/login`, {
  //     data: { email: user.email, password: user.password },
  //   });
  //   expect(res.status()).toBe(200);
  //   return (await res.json()).access_token;
  // }
  // async function getProducts(request: APIRequestContext, count = 4): Promise<Product[]> {
  //   const res = await request.get(`${API_URL}/products?page=1`);
  //   expect(res.status()).toBe(200);
  //   const body = await res.json();
  //   return body.data.slice(0, count).map((p: any) => ({ id: p.id, name: p.name }));
  // }
  // /** Seed a favorite through the API (fast set-up, keeps UI tests focused). */
  // async function addFavoriteViaApi(request: APIRequestContext, token: string, productId: string) {
  //   return request.post(`${API_URL}/favorites`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //     data: { product_id: productId },
  //   });
  // }
  // async function listFavoritesViaApi(request: APIRequestContext, token: string) {
  //   const res = await request.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${token}` } });
  //   expect(res.status()).toBe(200);
  //   return (await res.json()) as any[];
  // }
  // let user: UserData;
  // let token: string;
  // let products: Product[];
  // let login: LoginPage;
  // let favorites: FavoritesPage;
  // let productPage: ProductPage;
  // async function signIn(page: Page) {
  //   await login.goto();
  //   await login.login(user.email, user.password);
  //   await login.expectLoggedIn();
  // }
  // test.beforeEach(async ({ page, request }) => {
  //   user = validUser();
  //   await createUserViaApi(request, user);
  //   token = await apiToken(request, user);
  //   products = await getProducts(request);
  //   login = new LoginPage(page);
  //   favorites = new FavoritesPage(page);
  //   productPage = new ProductPage(page);
  // });
  // const context = await request.newContext({
  //     baseURL: process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com'
  // });
  // const response = await context.post('/users/login', {
  //     data: { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
  // });
  // expect(response.status()).toBe(200);
  // const { access_token } = await response.json();
  // fs.mkdirSync('.auth', { recursive: true });
  // fs.writeFileSync('.auth/api-token.json', JSON.stringify({ access_token }));
// });
