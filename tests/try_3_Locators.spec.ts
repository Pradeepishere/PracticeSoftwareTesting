import { test, expect } from "@playwright/test";
import { PageObjectManager } from "../pages/PageObjectManager";

let pom: PageObjectManager;
let prod = "Pliers";

// test.describe(async () => {
//   test.beforeEach(async ({ page, request }) => {
//     pom = new PageObjectManager(page, request);
//     await page.goto("/");
//   });
//   test.skip("try Favorites", async ({ page }) => {
//     await expect(await pom.home.allProd_Name.first()).toBeVisible();
//     await expect(await pom.home.allProd_inPage.last()).toBeVisible();

//     console.log(
//       "1 : ",
//       await page
//         .locator(".row .container")
//         .locator(".card-title")
//         .getByText("Pliers", { exact: false })
//         .allInnerTexts(),
//     );
//     console.log(
//       "2 : ",
//       await page
//         .locator(".row .container")
//         .locator(".card-title")
//         .getByText("Bolt Cutters", { exact: true })
//         .textContent(), // 2 :   Bolt Cutters
//     );
//     console.log(
//       "3-a : ",
//       await page
//         .locator(".row .container")
//         .locator(".card-title")
//         .getByText("Claw", { exact: false })
//         .allTextContents(), // 2 :   all Claw products
//     );
//     console.log(
//       "3-b : ",
//       await page
//         .locator(".row .container")
//         .locator(".card-title")
//         .getByText("Claw", { exact: false })
//         .first()
//         .textContent(), // 2 :   First  Claw products
//     );
//     console.log(
//       "4 :Matching count :",
//       await page.locator(".card-title").filter({ hasText: "Pliers" }).count(), // 3 : Matching count: 4
//     );
//     console.log(
//       "5-a : All Pliers prod Name  :",
//       await page
//         .locator(".card-title")
//         .filter({ hasText: "Pliers" })
//         .allTextContents(), // All Prod Pliers Name
//     );
//     console.log(
//       "5-b : nth() :",
//       await page
//         .locator(".card-title")
//         .filter({ hasText: "Pliers" })
//         .nth(3)
//         .textContent(), // 3rd Pliers Name
//     );
//     console.log(
//       "5-c : first prod Name :",
//       await page
//         .locator(".card-title")
//         .filter({ hasText: "Pliers" })
//         .first()
//         .textContent(), // 1st Pliers name
//     );
//     console.log(
//       "5-c : first prod Name :",
//       await page
//         .locator(".card-title")
//         .filter({ hasText: "Pliers" })
//         .first()
//         .textContent(), // 1st Pliers name
//     );

//     console.log(
//       "6-a : All product titles:",
//       await page.locator(".card-title").allTextContents(),
//     ); // prints all products Name all 9 in a page i arrays[]

//     console.log(
//       " 6-b : ",
//       await pom.home.allProd_Name
//         .filter({ hasText: "Hammer" })
//         .allTextContents(),
//     );
//     //          print Products Name having/ containing name ->  Hammer

//     console.log(
//       "7 : ",
//       await page
//         .locator('[data-test="product-name"]', { hasText: prod })
//         .first()
//         .textContent(),
//     ); //  Combination Pliers
//     console.log("8 : ", await page.locator(".card-title").last().textContent());

//     await page.waitForTimeout(2000);
//   });
// });
