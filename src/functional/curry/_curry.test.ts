import { describe, it, expect, expectTypeOf } from 'vitest';
import { curry, anyCurry } from '.';

describe('curry', () => {
	function a(a: number, b: string, c: boolean) {
		return a + b + c;
	}

	const result = curry(a);

	it('curry type', () => {
		expectTypeOf(result).parameters.toMatchTypeOf<[number]>();
		expectTypeOf(result(1)).parameters.toMatchTypeOf<[string]>();
		expectTypeOf(result(1)('2')).parameters.toMatchTypeOf<[boolean]>();
		expectTypeOf(result(1)('2')(false)).toMatchTypeOf<string>();
	});

	it('curry use', () => {
		expect(result(1)('2')(false)).toBe('12false');
	});
});

describe('anyCurry', () => {
	function a(a: number, b: string, c: boolean) {
		return a + b + c;
	}

	const result = anyCurry(a);

	it('anyCurry type', () => {
		expectTypeOf(result).parameters.toMatchTypeOf<
			[number?, string?, boolean?]
		>();
		expectTypeOf(result(1)).parameters.toMatchTypeOf<[string?, boolean?]>();
		expectTypeOf(result(1)('2')).parameters.toMatchTypeOf<[boolean?]>();
		expectTypeOf(result(1)('2')(true)).toMatchTypeOf<string>();
	});

	it('anyCurry use', () => {
		expect(result(1, '2')(false)).toBe('12false');
	});
});
