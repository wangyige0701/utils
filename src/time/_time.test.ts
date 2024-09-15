import { describe, expect, it } from 'vitest';
import { delay } from '@/time';

describe('time', () => {
	it('delay', async () => {
		const start = performance.now();
		await delay(1000);
		const end = performance.now();
		expect(end - start).toBeGreaterThanOrEqual(1000);
	});

	it('delay with callback', async () => {
		const start = performance.now();
		let i = 0;
		await delay(1000, () => {
			i++;
		});
		expect(i).toBe(1);
		expect(performance.now() - start).toBeGreaterThanOrEqual(1000);
		await delay(1000, async () => {
			i++;
			await delay(1000);
		});
		expect(i).toBe(2);
		expect(performance.now() - start).toBeGreaterThanOrEqual(3000);
	});
});
