import { expect, test } from '@playwright/test';

test('index page has a sign in button', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Sign in via keycloak' })).toBeVisible();
});
