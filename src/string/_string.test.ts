import { describe, expect, it } from 'vitest';
import {
	firstUpperCase,
	firstLowerCase,
	upperCase,
	lowerCase,
	splitByUpper,
	splitBySpace,
	splitByUnderscore,
	splitByPoint,
	randomString,
} from '@/string';

describe('string', () => {
	it('firstUpperCase', () => {
		expect(firstUpperCase('hello')).toBe('Hello');
		expect(firstUpperCase('Hello')).toBe('Hello');
	});

	it('firstLowerCase', () => {
		expect(firstLowerCase('hello')).toBe('hello');
		expect(firstLowerCase('HELLO')).toBe('hELLO');
	});

	it('upperCase', () => {
		expect(upperCase('hello')).toBe('HELLO');
		expect(upperCase('HELLO')).toBe('HELLO');
	});

	it('lowerCase', () => {
		expect(lowerCase('hello')).toBe('hello');
		expect(lowerCase('HELLO')).toBe('hello');
	});

	it('splitByUpper', () => {
		expect(splitByUpper('HelloWorld')).toEqual(['Hello', 'World']);
		const iterator = splitByUpper.iterator('HelloWorld');
		expect(iterator.next().value).toBe('Hello');
		expect(iterator.next().value).toBe('World');
		expect(iterator.next().done).toBe(true);
	});

	it('splitBySpace', () => {
		expect(splitBySpace('Hello World')).toEqual(['Hello', 'World']);
		const iterator = splitBySpace.iterator('Hello   World');
		expect(iterator.next().value).toBe('Hello');
		expect(iterator.next().value).toBe('World');
		expect(iterator.next().done).toBe(true);
	});

	it('splitByUnderscore', () => {
		expect(splitByUnderscore('Hello_World')).toEqual(['Hello', 'World']);
		const iterator = splitByUnderscore.iterator('Hello__World');
		expect(iterator.next().value).toBe('Hello');
		expect(iterator.next().value).toBe('World');
		expect(iterator.next().done).toBe(true);
	});

	it('splitByPoint', () => {
		expect(splitByPoint('Hello.World')).toEqual(['Hello', 'World']);
		const iterator = splitByPoint.iterator('Hello.World');
		expect(iterator.next().value).toBe('Hello');
		expect(iterator.next().value).toBe('World');
		expect(iterator.next().done).toBe(true);
	});

	it('randomString', () => {
		const a = randomString(10);
		const b = randomString(10);
		expect(a.length).toBe(10);
		expect(b.length).toBe(10);
		expect(a).not.toBe(b);
	});
});
