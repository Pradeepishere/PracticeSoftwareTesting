import { test as base } from '@playwright/test';
import { PageObjectManager } from '../pages/PageObjectManager';
import { dynamic_buildUser_Data, uniqueEmail } from '../utils/testData';

type LoginFixture = {
    pom: PageObjectManager;
    loggedInUser: {
        email: string;
        password: string;
    };
};

export const test = base.extend<LoginFixture>({

    pom: async ({ page, request }, use) => {                // Create Page Object Manager
        const pom = new PageObjectManager(page, request);
        await use(pom);
    },

    loggedInUser: async ({ pom }, use) => {
        const user = dynamic_buildUser_Data({       // Generate dynamic user data
            email: uniqueEmail(),
            firstName: 'Qinn'
        });

        await pom.register.goto_Register();                 // Register user
        await pom.register.fillForm(user);
        await pom.register.click_Register_btn();
        await pom.register.expect_Registeration_Success();

        // Login user
        await pom.login.login_cred(user.email, user.password);
        await pom.login.expect_LoggedIn();

        // Provide logged-in user to the test
        await use({
            email: user.email,
            password: user.password
        });
    }

});

export { expect } from '@playwright/test';