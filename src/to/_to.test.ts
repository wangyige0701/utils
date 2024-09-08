import { describe, it, expect } from 'vitest';
import { toString, toNumber, toBoolean, toArray, toRegExp } from '.';

describe('to', () => {
	it('toString', () => {
		expect(toString(123)).toBe('123');
		expect(toString('123')).toBe('123');
		expect(toString(true)).toBe('true');
		expect(toString({ a: 2 })).toBe('{"a":2}');
		expect(toString([1, 'a'])).toBe('[1,"a"]');
		expect(toString(undefined)).toBe('undefined');
		expect(toString(null)).toBe('null');
	});

	it('toNumber', () => {
		expect(toNumber(123)).toBe(123);
		expect(toNumber('123')).toBe(123);
		expect(toNumber(true)).toBe(1);
		expect(toNumber(false)).toBe(0);
		expect(toNumber({ a: 2 })).toBe(0);
		expect(toNumber([1, 'a'])).toBe(0);
	});

	it('toBoolean', () => {
		expect(toBoolean(123)).toBe(true);
		expect(toBoolean('123')).toBe(true);
		expect(toBoolean('true')).toBe(true);
		expect(toBoolean('false')).toBe(false);
		expect(toBoolean(true)).toBe(true);
		expect(toBoolean(false)).toBe(false);
		expect(toBoolean({ a: 2 })).toBe(true);
		expect(toBoolean([1, 'a'])).toBe(true);
		expect(toBoolean(undefined)).toBe(false);
	});

	it('toArray', () => {
		expect(toArray(123)).toEqual([123]);
		expect(toArray('123')).toEqual(['123']);
		expect(toArray([1, 2, 3])).toEqual([1, 2, 3]);
	});

	it('toRegExp', () => {
		expect(toRegExp('abc')).toEqual(/abc/);
		expect(toRegExp('abc', 'i')).toEqual(/abc/i);
		expect(toRegExp(/abc/)).toEqual(/abc/);
		expect(toRegExp(/abc/, 'def', 'g')).toEqual(/abcdef/g);
	});
});
