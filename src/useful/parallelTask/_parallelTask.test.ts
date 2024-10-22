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

	it('on empty with once', async () => {
		const task = new ParallelTask(2);
		let i = 0;
		let j = 0;
		task.add(delay, 100);
		task.add(delay, 100);
		task.add(delay, 100);
		task.onEmpty(() => {
			i++;
		});
		task.onEmpty(() => {
			j++;
		}, false);
		await delay(400);
		expect(i).toBe(1);
		expect(j).toBe(1);
		task.add(delay, 100);
		task.add(delay, 100);
		task.onEmpty(() => {
			i++;
		});
		await delay(400);
		expect(i).toBe(2);
		expect(j).toBe(2);
	});

	it('cancel', async () => {
		const task = new ParallelTask(2);
		let i = 0;
		const func = async () => {
			await delay(100);
			i++;
		};
		await task.add(func);
		await task.add(func);
		const use1 = task.add(func);
		const use2 = task.add(func);
		use1.cancel();
		task.cancel(use2.index);
		expect(i).toBe(2);
	});

	it('is executed', async () => {
		const task = new ParallelTask(1);
		task.add(delay, 1500);
		const use1 = task.add(delay, 500);
		expect(task.isPending(use1.index)).toBe(true);
		const use2 = task.add(delay, 100);
		use2.cancel();
		expect(task.isPending(use2.index)).toBe(false);
		const use3 = task.add(delay, 100);
		await use3;
		expect(task.isPending(use3.index)).toBe(false);
	});
});
