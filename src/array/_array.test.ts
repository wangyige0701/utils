import { describe, expect, expectTypeOf, it } from 'vitest';
import { joinElements, at, last, first } from '@/array';

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
});
