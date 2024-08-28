import { describe, it, expect } from 'vitest';
import { rangeIterator } from './index';

describe('Iterator', () => {
	it('rangeIterator', () => {
		{
			const iterator = rangeIterator(5);
			const check = [...iterator];
			expect(check).toEqual([0, 1, 2, 3, 4]);
		}
		{
			const iterator = rangeIterator(0, 10, 2);
			const check = [...iterator];
			expect(check).toEqual([0, 2, 4, 6, 8]);
		}
		{
			const iterator = rangeIterator(6, 0, 1);
			const check = [...iterator];
			expect(check).toEqual([6, 5, 4, 3, 2, 1]);
		}
		{
			const iterator = rangeIterator(0, -5, 3);
			const check = [...iterator];
			console.log(check);
			expect(check).toEqual([0, -3]);
		}
	});
});
