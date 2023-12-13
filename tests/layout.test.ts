import { expect, test } from '@playwright/test';

test('index page has a sign in button', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

test('trying to access protected page redirects to login', async ({ page, baseURL }) => {
	await page.goto('/map');
	expect(page.url()).toBe(`${baseURL}/auth/signin`);
});
