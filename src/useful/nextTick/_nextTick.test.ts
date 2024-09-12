import { describe, expect, it } from 'vitest';
import { nextTick } from '.';
import { delay } from '@/time';

describe('nextTick', () => {
	it('use nextTick', async () => {
		let i = 0;
		function test() {
			return new Promise(resolve => {
				nextTick(() => {
					i = 20;
					resolve(true);
				});
			});
		}
		test();
		i = 1;
		await delay(300);
		expect(i).toBe(20);
	});
});
