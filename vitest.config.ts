import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'json', 'html'],
			reportsDirectory: './.coverage',
		},
		typecheck: {
			only: true,
			checker: 'tsc',
			include: ['**/*.d.{test,spec}.?(c|m)[jt]s?(x)'],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
