import { test, expect } from '@playwright/test';

const URL_Address = 'https://example.com/login';
const login_user = 'user@example.com';
const pesel_user = '00000000000';
const password_user = 'Password123!';
const correct_login_URL = 'https://example.com/dashboard';
const lockout_login_user = 'lockeduser@example.com';
const lockout_password_user = 'WrongPass123!';
const incorrect_login_user = 'invaliduser@example.com';
const incorrect_password_user = 'WrongPass%%';
const emailTextbox = { name: 'E-mail, PESEL lub' };
const passwordTextbox = { name: 'Hasło' };
const loginButton = { name: 'Zaloguj się', exact: true };
const wrongCredentialsMessage = 'xpath=//*[@id="root"]/div[1]/div[1]/section/div/div[2]/div[1]/p';
const loginWithoutPasswordInput = 'xpath=//*[@id="root"]/div[1]/div/section/div/div[2]/div[2]/div/div/input';
const buttonLoginWithoutPassword = 'xpath=//*[@id="root"]/div[1]/div/section/div/div[2]/div[2]/button';
const withoutPasswordMessage = 'xpath=//*[@id="root"]/div[1]/div/section/div/div[2]/p[2]';
const errorMessageLockout = 'xpath=//*[@id="root"]/div[1]/div[1]/section/div/div[2]/div[1]/p';

test('CorrectCredentials_test', async ({ page }) => {
  const loginInput = page.getByRole('textbox', emailTextbox);
  const passwordInput = page.getByRole('textbox', passwordTextbox);
  const loginButtonElement = page.getByRole('button', loginButton);
  await page.goto(URL_Address);
  await loginInput.click();
  await loginInput.fill(login_user);
  await passwordInput.click();
  await passwordInput.fill(password_user);
  await loginButtonElement.click();
  await expect(page).toHaveURL(correct_login_URL);
});

test('CorrectCredentialsPesel_test', async ({ page }) => {
  const loginInput = page.getByRole('textbox', emailTextbox);
  const passwordInput = page.getByRole('textbox', passwordTextbox);
  const loginButtonElement = page.getByRole('button', loginButton);
  await page.goto(URL_Address);
  await loginInput.click();
  await loginInput.fill(pesel_user);
  await passwordInput.click();
  await passwordInput.fill(password_user);
  await loginButtonElement.click();
  await expect(page).toHaveURL(correct_login_URL);
});

test('AccountLockoutAfter5Tries_test', async ({ page }) => {
  for (let i = 1; i <= 5; i++) {
    const loginInput = page.getByRole('textbox', emailTextbox);
    const passwordInput = page.getByRole('textbox', passwordTextbox);
    const errorMessage = page.locator(errorMessageLockout);
    const loginButtonElement = page.getByRole('button', loginButton);
    await page.goto(URL_Address);
    await loginInput.click();
    await loginInput.fill(lockout_login_user);
    await passwordInput.click();
    await passwordInput.fill(lockout_password_user);
    await loginButtonElement.click();
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    if (i === 5) {
      await expect(errorMessage).toContainText('Zostało ono tymczasowo zablokowane na okres 5 minut.');
    }
  }
});

test('IncorrectCredentials_test', async ({ page }) => {
  const loginInput = page.getByRole('textbox', emailTextbox);
  const passwordInput = page.getByRole('textbox', passwordTextbox);
  const errorMessage = page.locator(wrongCredentialsMessage);
  const loginButtonElement = page.getByRole('button', loginButton);
  await page.goto(URL_Address);
  await loginInput.click();
  await loginInput.fill(incorrect_login_user);
  await passwordInput.click();
  await passwordInput.fill(incorrect_password_user);
  await loginButtonElement.click();
  await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
  await expect(errorMessage).toContainText('Nieprawidłowe dane logowania');
});

test('LoggingWithoutPassword_test', async ({ page }) => {
  const loginInputNoPassword = page.locator(loginWithoutPasswordInput);
  const loggedWithoutPasswordMessage = page.locator(withoutPasswordMessage);
  const loginWithoutPasswordButtonElement = page.locator(buttonLoginWithoutPassword);
  await page.goto(URL_Address);
  await loginInputNoPassword.click();
  await loginInputNoPassword.fill(login_user);
  await loginWithoutPasswordButtonElement.click();
  await loggedWithoutPasswordMessage.waitFor({ state: 'visible', timeout: 5000 });
  await expect(loggedWithoutPasswordMessage).toContainText('Na podany adres e-mail lub nr telefonu');
});

test('LoggingWithEmptyPassword_test', async ({ page }) => {
  const loginInput = page.getByRole('textbox', emailTextbox);
  const loginButtonElement = page.getByRole('button', loginButton);
  const passwordWarning = page.locator('#password-helper-text');
  await page.goto(URL_Address);
  await loginInput.click();
  await loginInput.fill(login_user);
  await loginButtonElement.click();
  await passwordWarning.waitFor({ state: 'visible', timeout: 5000 });
  await expect(passwordWarning).toContainText('Pole jest wymagane');
});

test('LoggingWithEmptyLogin_test', async ({ page }) => {
  const passwordInput = page.getByRole('textbox', passwordTextbox);
  const loginButtonElement = page.getByRole('button', loginButton);
  const loginWarning = page.locator('#username-helper-text');
  await page.goto(URL_Address);
  await passwordInput.click();
  await passwordInput.fill(password_user);
  await loginButtonElement.click();
  await loginWarning.waitFor({ state: 'visible', timeout: 5000 });
  await expect(loginWarning).toContainText('Pole jest wymagane');
});

test('LoggingWithoutCredentials_test', async ({ page }) => {
  const loginButtonElement = page.getByRole('button', loginButton);
  const loginWarning = page.locator('#username-helper-text');
  const passwordWarning = page.locator('#password-helper-text');
  await page.goto(URL_Address);
  await loginButtonElement.click();
  await loginWarning.waitFor({ state: 'visible', timeout: 5000 });
  await passwordWarning.waitFor({ state: 'visible', timeout: 5000 });
  await expect(passwordWarning).toContainText('Pole jest wymagane');
  await expect(loginWarning).toContainText('Pole jest wymagane');
});
