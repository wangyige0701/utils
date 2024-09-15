import { describe, it, expect } from 'vitest';
import { delay } from '@/time';
import { throttle } from '@/useful';

describe('throttle', () => {
	it('use throttle', async () => {
		let i = 0;
		function test(a: number, b: string, c: boolean) {
			i++;
		}
		const result = throttle(test, 1000);
		result(1, 'a', true);
		result(1, 'a', true);
		result(1, 'a', true);
		await delay(1000);
		result(1, 'a', true);
		expect(i).toBe(2);
	});

	it('use throttle with fixed args', async () => {
		let i = 0;
		function test(a: number, b: string, c: boolean) {
			i++;
		}
		const result = throttle(test, { duration: 1000, fixedArgs: [1] });
		result('a', true);
		result('a', true);
		result('a', true);
		await delay(1000);
		result('a', true);
		expect(i).toBe(2);
	});
});
