import { describe, expect, it } from 'vitest';
import { delay, checkFrequency } from '@/time';

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

	it('checkFrequency', async () => {
		let i = 0;
		let j = 0;
		const check = checkFrequency(
			{
				range: 1000,
				maximum: 2,
			},
			(options, current) => {
				console.log(options);
				i++;
				j = current;
			},
		);
		check(1);
		check(1);
		check(1);
		check(1);
		check(1);
		expect(i).toBe(3);
		expect(j).toBe(5);
		await delay(1000);
		check(1);
		await delay(500);
		check(1);
		await delay(500);
		check(3);
		expect(i).toBe(4);
		expect(j).toBe(4);
	});

	it('checkFrequency with type', async () => {
		let i = 0;
		let j = 0;
		const check = checkFrequency(
			{
				range: 1000,
				maximum: 2,
			},
			(options, current, type) => {
				console.log(options, current, type);
				i++;
				j = current;
			},
		);
		check(1, 'a');
		check(1, 'b');
		check(1, 'c');
		check(1, 'd');
		check(1, 'e');
		check(1, 'e');
		check(1, 'e');
		expect(i).toBe(1);
		expect(j).toBe(3);
	});
});
