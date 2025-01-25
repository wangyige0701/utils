import { describe, expect, expectTypeOf, it } from 'vitest';
import {
	joinElements,
	at,
	last,
	first,
	asyncForeach,
	arrayUnique,
} from '@/array';
import { delay } from '@/time';

describe('array', () => {
	it('joinElements', () => {
		const a = joinElements(1, 2, 3);
		expect(a).toBe('123');
		expectTypeOf(a).toMatchTypeOf<'123'>();
		const b = joinElements.separate(',')('a', 'b', 'c');
		expect(b).toBe('a,b,c');
		expectTypeOf(b).toMatchTypeOf<'a,b,c'>();
	});

	it('at', () => {
		const arr = [1, 2, 3];
		expect(at(arr, 1)).toBe(2);
		expect(at(arr, -1)).toBe(3);
		expect(at(arr, 3)).toBe(undefined);
		expect(at(arr, -2)).toBe(2);
		expect(at(arr, -4)).toBe(undefined);
	});

	it('last', () => {
		expect(last([1, 2, 3])).toBe(3);
		expect(last([])).toBe(undefined);
	});

	it('first', () => {
		expect(first([1, 2, 3])).toBe(1);
		expect(first([])).toBe(undefined);
	});

	it('asyncForeach', async () => {
		const arr = [1, 2, 3];
		const start = performance.now();
		const result = await asyncForeach(arr, async item => {
			await delay(300);
			return item * 2;
		});
		expect(result).toEqual([2, 4, 6]);
		expect(performance.now() - start).toBeGreaterThanOrEqual(900); // 3 * 300
	});

	it('arrayUnique', () => {
		const arr = [1, 2, 3, 1, 2, 3];
		expect(arrayUnique(arr)).toEqual([1, 2, 3]);
	});
});
