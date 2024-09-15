import { describe, it, expect } from 'vitest';
import { delay } from '@/time';
import { ParallelTask } from '@/useful';

describe('ParallelTask', () => {
	it('use parallelTask', async () => {
		const time = 300;
		const max = 5;
		const i = 9;
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
		await use(i);
		const end = performance.now();
		console.log(end - now, 'ms');
		expect(end - now).toBeGreaterThanOrEqual(time * (1 / max));
	});
});
