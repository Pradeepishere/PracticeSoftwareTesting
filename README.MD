(1) Run all four files in sequence
-> npx playwright test

(2) Run only Register.spec.ts
Runs the registration project without setup ( storageState).

-> npx playwright test --project=register --no-deps

(3) Run only Login.spec.ts
Skips register and setup dependencies ( storageState).

-> npx playwright test --project=login --no-deps

(4) Run only Forgot_Password.spec.ts
Runs only the forgot-password project ( storageState).

-> npx playwright test --project=forgotPassword --no-deps

(5) Run only Profile.spec.ts
Runs only the profile project using its configured storage state ( storageState).

-> npx playwright test --project=profile --no-deps
