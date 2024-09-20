import { describe, it, expect } from 'vitest';
import { createPromise } from '@/promise';

describe('promise', () => {
	it('createPromise', async () => {
		const start = performance.now();
		const { promise: promise1, resolve } = createPromise<void>();
		setTimeout(() => {
			resolve();
		}, 1000);
		await promise1;
		expect(performance.now() - start).toBeGreaterThanOrEqual(1000);
	});
});
