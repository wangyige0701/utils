import { describe, it, expect, expectTypeOf } from 'vitest';
import type { Fn } from '@/types';
import { createPromise } from '@/promise';

describe('promise', () => {
	it('createPromise', async () => {
		const start = performance.now();
		const { promise, resolve } = createPromise<void>();
		setTimeout(() => {
			resolve();
		}, 1000);
		await promise;
		expect(performance.now() - start).toBeGreaterThanOrEqual(1000);
		expectTypeOf(promise).toMatchTypeOf<Promise<void>>();

		const { promise: promise1 } = createPromise<
			number,
			Promise<string> & { cancel: Fn }
		>();
		expectTypeOf(promise1).toMatchTypeOf<
			Promise<string> & { cancel: Fn }
		>();
	});
});
