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
	});

	it('splitBySpace', () => {
		expect(splitBySpace('Hello World')).toEqual(['Hello', 'World']);
	});

	it('splitByUnderscore', () => {
		expect(splitByUnderscore('Hello_World')).toEqual(['Hello', 'World']);
	});
});
