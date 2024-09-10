import { describe, it, expect } from 'vitest';
import { delay } from '@/time';
import { debounce } from '.';

describe('debounce', () => {
	function test(a: number, b: string, c: boolean) {
		return a + b + c;
	}

	it('use debounce', async () => {
		const result = debounce(test, 1000);
		function use() {
			return new Promise(resolve => {
				result(1, 's', true).callback(res => {
					resolve(res);
				});
			});
		}
		let timer = performance.now();
		const res = await use();
		expect(performance.now() - timer).toBeGreaterThanOrEqual(1000);
		expect(res).toBe(1 + 's' + true);
	});

	it('debounce with fixed paramaters', async () => {
		const result = debounce(test, { delay: 500, fixedArgs: [5] });
		function use() {
			return new Promise(resolve => {
				result('s', true).callback(res => {
					resolve(res);
				});
			});
		}
		let timer = performance.now();
		const res = await use();
		expect(performance.now() - timer).toBeGreaterThanOrEqual(500);
		expect(res).toBe(5 + 's' + true);
	});

	it('debounce cancel', async () => {
		const result = debounce(test, 300);
		function use() {
			return new Promise(resolve => {
				result(1, 's', true).callback(res => {
					resolve(res);
				});
			});
		}
		let timer = performance.now();
		await use();
		await delay(200);
		await use();
		await delay(200);
		const res = await use();
		expect(performance.now() - timer).toBeGreaterThanOrEqual(700);
		expect(res).toBe(1 + 's' + true);

		timer = performance.now();
		const imme = result.immediate(1, 's', true);
		expect(imme).toBe(1 + 's' + true);
		const canc = result(1, 's', true).cancel();
		expect(canc).toBeUndefined();
		expect(performance.now() - timer).toBeLessThan(300);
	});
});
