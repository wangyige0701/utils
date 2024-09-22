import { describe, it, expect, expectTypeOf } from 'vitest';
import type { Fn } from '@/types';
import { createPromise, extendPromise } from '@/promise';

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

	it('extendPromise', async () => {
		function prom<T>(v: boolean, n: T) {
			return new Promise<T>((resolve, reject) => {
				if (v) {
					resolve(n);
				} else {
					reject(n);
				}
			});
		}
		const a = extendPromise(prom(true, 1), 2, 3, '4');
		await expect(a).resolves.toEqual([1, 2, 3, '4']);
		const b = extendPromise(prom(false, 1), 2, 3, 4);
		await expect(b).rejects.toBe(1);
		const c = extendPromise(1, true);
		await expect(c).resolves.toEqual([1, true]);
	});
});
