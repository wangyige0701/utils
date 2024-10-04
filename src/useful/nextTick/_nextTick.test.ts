import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { delay } from '@/time';

describe.concurrent('nextTick', () => {
	describe('use nextTick with process.nextTick', () => {
		let i = 0;
		function test(
			nextTick: typeof import('./index').nextTick,
			num: number,
		) {
			return new Promise(resolve => {
				nextTick(() => {
					i = num;
					resolve(true);
				});
			});
		}
		it('use nextTick', async () => {
			const nextTick = (await import('./index')).nextTick;
			test(nextTick, 2);
			i = 1;
			await delay(300);
			expect(i).toBe(2);
		});
	});

	describe('use nextTick with promise', () => {
		let i = 0;
		function test(
			nextTick: typeof import('./index').nextTick,
			num: number,
		) {
			return new Promise(resolve => {
				nextTick(() => {
					i = num;
					resolve(true);
				});
			});
		}
		beforeAll(() => {
			vi.stubGlobal('process', {
				nextTick: undefined,
			});
		});
		afterAll(() => {
			vi.unstubAllGlobals();
		});
		it('use nextTick', async () => {
			const nextTick = (await import('./index')).nextTick;
			test(nextTick, 3);
			i = 1;
			await delay(300);
			expect(i).toBe(3);
		});
	});
});
