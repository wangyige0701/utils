import { describe, it, expect } from 'vitest';
import { UseFunction } from '@/function';
import { delay } from '@/time';

describe('useFunction', () => {
	it('should run with queue type', () => {
		const a = new UseFunction();
		function test(t: number) {
			// console.log(t);
			return t;
		}
		a.add(test.bind(null, 1));
		a.add(test.bind(null, 2));
		a.add(test.bind(null, 3));
		a.add(test.bind(null, 4));
		a.add(test.bind(null, 5));
		expect(a.next()).toBe(1);
		expect(a.next()).toBe(2);
		expect(a.next()).toBe(3);
		expect(a.next()).toBe(4);
		a.reset();
		expect(a.next()).toBe(1);
		expect(a.next()).toBe(2);
		expect(a.next()).toBe(3);
		expect(a.next()).toBe(4);
		expect(a.next()).toBe(5);
		expect(a.next()).toBe(1);
	});

	it('should run async with queue type', async () => {
		const a = new UseFunction({
			async: true,
		});
		async function test(t: number) {
			await delay(10);
			return t;
		}
		a.add(() => test(1));
		a.add(() => test(2));
		a.add(() => test(3));
		a.add(() => test(4));
		const start = performance.now();
		expect(await a.next()).toBe(1);
		expect(await a.next()).toBe(2);
		expect(await a.next()).toBe(3);
		a.reset();
		expect(await a.next()).toBe(1);
		expect(await a.next()).toBe(2);
		expect(await a.next()).toBe(3);
		expect(await a.next()).toBe(4);
		expect(await a.next()).toBe(1);
		expect(performance.now() - start).toBeGreaterThanOrEqual(80);
	});

	it('should called all', () => {});
});
