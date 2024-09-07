import { describe, it, expect, expectTypeOf } from 'vitest';
import { pipe } from '.';

describe('pipe', () => {
	function a(a: string): number {
		return 1;
	}

	function b(a: number): boolean {
		return true;
	}

	function c(a: boolean): string {
		return '1';
	}

	const result = pipe(a, b, c);

	it('pipe type', () => {
		expectTypeOf(result).toMatchTypeOf<(a: string) => string>();
		expectTypeOf(result).parameter(0).toMatchTypeOf<string>();
		expectTypeOf(result('a')).toMatchTypeOf<string>();
	});

	it('pipe use', () => {
		expect(result('a')).toBe('1');
	});

	it('pipe result', () => {
		function d(a: string): number {
			return +a;
		}

		function e(a: number): boolean {
			return a > 0;
		}

		const use = pipe(d, e);

		expect(use('-1')).toBe(false);
	});
});
