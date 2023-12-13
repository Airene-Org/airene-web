import type { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	reporter: [['junit', { outputFile: './coverage/test-results-playwright.xml' }]]
};

export default config;
