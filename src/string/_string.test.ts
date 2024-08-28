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
	it(firstUpperCase.name, () => {
		expect(firstUpperCase('hello')).toBe('Hello');
		expect(firstUpperCase('Hello')).toBe('Hello');
	});

	it(firstLowerCase.name, () => {
		expect(firstLowerCase('hello')).toBe('hello');
		expect(firstLowerCase('HELLO')).toBe('hELLO');
	});

	it(upperCase.name, () => {
		expect(upperCase('hello')).toBe('HELLO');
		expect(upperCase('HELLO')).toBe('HELLO');
	});

	it(lowerCase.name, () => {
		expect(lowerCase('hello')).toBe('hello');
		expect(lowerCase('HELLO')).toBe('hello');
	});

	it(splitByUpper.name, () => {
		expect(splitByUpper('HelloWorld')).toEqual(['Hello', 'World']);
	});

	it(splitBySpace.name, () => {
		expect(splitBySpace('Hello World')).toEqual(['Hello', 'World']);
	});

	it(splitByUnderscore.name, () => {
		expect(splitByUnderscore('Hello_World')).toEqual(['Hello', 'World']);
	});
});
