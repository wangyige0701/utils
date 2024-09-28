import { describe, it, expect } from 'vitest';
import { ProcessTask } from '@/useful';
import { delay } from '@/time';

describe('ProcessTask', () => {
	it('should return a promise', async () => {
		const testFuncs = Array.from({ length: 5 }).map((_, index) => {
			return async () => {
				await delay(300);
				return index;
			};
		});
		const task = new ProcessTask(...testFuncs);
		const start = performance.now();
		const result = await task.start();
		expect(result).toEqual([0, 1, 2, 3, 4]);
		expect(performance.now() - start).toBeGreaterThanOrEqual(1500);
	});

	it('should stop when use pause function', async () => {
		const testFuncs = Array.from({ length: 5 }).map((_, index) => {
			return async () => {
				await delay(1000);
				return index;
			};
		});
		const task = new ProcessTask(...testFuncs);
		const start = performance.now();
		task.start();
		await delay(800);
		task.pause();
		await delay(2000);
		const result = await task.start();
		expect(result).toEqual([0, 1, 2, 3, 4]);
		expect(performance.now() - start).toBeGreaterThanOrEqual(6000);
	}, 10000);

	it('continous use start function', async () => {
		const testFuncs = Array.from({ length: 5 }).map((_, index) => {
			return async () => {
				await delay(500);
				return index;
			};
		});
		const task = new ProcessTask(...testFuncs);
		const start = performance.now();
		const first = task.start();
		const result = await task.start();
		expect(result).toEqual([0, 1, 2, 3, 4]);
		expect(await first).toEqual([0, 1, 2, 3, 4]);
		expect(performance.now() - start).toBeGreaterThanOrEqual(2500);
	});
});
