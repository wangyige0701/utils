import { describe, it, expect } from 'vitest';
import { UseFunction } from '@/function';
import { delay } from '@/time';

describe('useFunction', () => {
	it('should run', () => {
		const a = new UseFunction();
		function test(t: number) {
			console.log(t);
		}
		a.add(test.bind(null, 1));
		const use = test.bind(null, 2);
		a.add(use);
		a.add(test.bind(null, 3));
		a.add(test.bind(null, 4));
		a.add(test.bind(null, 5));

		a.one();
		a.remove(use);
		a.one();
		a.one();
		a.one();
		a.one();
		a.one();
		a.one();
		a.one();
	});

	it('should run async', async () => {
		const a = new UseFunction({
			async: true,
		});

		a.add(async () => {
			await delay(300);
			console.log(1);
			return 1;
		});

		a.add(async () => {
			await delay(300);
			console.log(2);
			return 2;
		});

		const one = await a.one();
		console.log(3);
		const two = await a.one();
		console.log(one, two);
	});
});
