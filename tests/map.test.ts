import { expect, test } from '@playwright/test';

// TODO: remove skip once we get actual data from the backend in prod
test.skip('map loads', async ({ page, baseURL }) => {
	await page.goto(`${baseURL}/auth/signin`);
	await page.getByRole('button', { name: 'Sign in with Keycloak' }).click();
	await page.getByLabel('Username or email').fill(process.env.PLAYWRIGHT_EMAIL || '');
	await page.getByLabel('Password', { exact: true }).fill(process.env.PLAYWRIGHT_PASSWORD || '');
	await page.getByRole('button', { name: 'Sign In' }).click();
	await page.goto(`${baseURL}/map`);
	const map = page.getByTestId('map');
	await page.waitForLoadState('domcontentloaded');
	await expect(map).toBeVisible();
});
