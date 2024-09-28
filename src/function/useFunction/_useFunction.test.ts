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
		expect(a.use()).toBe(1);
		expect(a.use()).toBe(2);
		expect(a.use()).toBe(3);
		expect(a.use()).toBe(4);
		a.reset();
		expect(a.use()).toBe(1);
		expect(a.use()).toBe(2);
		expect(a.use()).toBe(3);
		expect(a.use()).toBe(4);
		expect(a.use()).toBe(5);
		expect(a.use()).toBe(1);
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
		expect(await a.use()).toBe(1);
		expect(await a.use()).toBe(2);
		expect(await a.use()).toBe(3);
		a.reset();
		expect(await a.use()).toBe(1);
		expect(await a.use()).toBe(2);
		expect(await a.use()).toBe(3);
		expect(await a.use()).toBe(4);
		expect(await a.use()).toBe(1);
		expect(performance.now() - start).toBeGreaterThanOrEqual(80);
	});

	it('should called all', async () => {
		const a = new UseFunction();
		let i = 0;
		function test() {
			i++;
		}
		a.add(test);
		a.add(test);
		a.add(test);
		a.add(test);
		a.add(test);
		a.all();
		expect(i).toBe(5);

		const b = new UseFunction({
			async: true,
		});
		async function asyncTest() {
			await delay(300);
			i++;
		}
		b.add(asyncTest);
		b.add(asyncTest);
		b.add(asyncTest);
		b.add(asyncTest);
		b.add(asyncTest);
		const start = performance.now();
		await b.all();
		expect(i).toBe(10);
		expect(performance.now() - start).toBeGreaterThanOrEqual(1500);
		a.all();
		expect(i).toBe(15);
	});

	it('should used with remove func', () => {
		const use = new UseFunction();
		const a1 = () => 1;
		const a2 = () => 2;
		const a3 = () => 3;
		const a4 = () => 4;
		const a5 = () => 5;
		use.add(a1);
		use.add(a2);
		use.add(a3);
		use.add(a4);
		use.add(a5);
		expect(use.use()).toBe(1);
		use.remove(a2);
		expect(use.use()).toBe(3);
		expect(use.use()).toBe(4);
		expect(use.use()).toBe(5);
		expect(use.use()).toBe(1);
	});

	it('should use when add func in using', () => {
		const use = new UseFunction();
		const a1 = () => 1;
		const a2 = () => 2;
		const a3 = () => 3;
		const a4 = () => 4;
		const a5 = () => 5;
		use.add(a1);
		use.add(a2);
		use.add(a3);
		expect(use.use()).toBe(1);
		expect(use.use()).toBe(2);
		expect(use.use()).toBe(3);
		use.add(a4);
		expect(use.use()).toBe(1);
		expect(use.use()).toBe(2);
		expect(use.use()).toBe(3);
		use.add(a5);
		expect(use.use()).toBe(4);
		expect(use.use()).toBe(5);
	});

	it('remove before execute function', () => {
		const use = new UseFunction();
		const a1 = () => 1;
		const a2 = () => 2;
		const a3 = () => 3;
		use.add(a1);
		use.add(a2);
		use.remove(a2);
		use.add(a3);
		expect(use.use()).toBe(1);
		expect(use.use()).toBe(3);
		expect(use.use()).toBe(1);
	});

	it('function use once', () => {
		const use = new UseFunction({
			once: true,
		});
		const a1 = () => 1;
		const a2 = () => 2;
		const a3 = () => 3;
		use.add(a1);
		use.add(a2);
		use.add(a3);
		expect(use.use()).toBe(1);
		expect(use.use()).toBe(2);
		expect(use.use()).toBe(3);
		expect(() => use.use()).toThrowError('Be used function is undefined');
	});
});
