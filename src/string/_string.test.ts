import { describe, expect, it } from 'vitest';
import {
	firstUpperCase,
	firstLowerCase,
	upperCase,
	lowerCase,
	splitByUpper,
	splitBySpace,
	splitByUnderscore,
} from '.';

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
});
