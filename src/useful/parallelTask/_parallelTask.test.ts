import { describe, it, expect } from 'vitest';
import { delay } from '@/time';
import { ParallelTask } from '@/useful';

describe('ParallelTask', () => {
	it('use parallelTask', async () => {
		async function run(time: number, max: number, all: number) {
			const now = performance.now();
			const task = new ParallelTask(3);
			task.changeMaxParallelCount(max);
			function use(i: number) {
				for (let j = 0; j < i; j++) {
					task.add(delay, time);
				}
				return new Promise<void>(resolve => {
					task.onEmpty(resolve);
				});
			}
			await use(all);
			const end = performance.now();
			expect(end - now).toBeGreaterThanOrEqual(
				time * Math.ceil(all / max),
			);
		}
		await run(300, 5, 9);
		await run(100, 2, 9);
		await run(200, 5, 4);
		await run(100, 10, 100);
	}, 5000);
});
