import { describe, it, expect, expectTypeOf } from 'vitest';
import {
	hasProp,
	getProp,
	objectKeys,
	isKeyOf,
	inEnum,
	objectPick,
} from '@/object';

describe.concurrent('object', () => {
	describe('hasOwn', () => {
		it('hasOwn use Object.hasOwn', async () => {
			const hasOwn = (await import('@/object')).hasOwn;

			const s = Symbol('s');
			const obj = { a: 1, [s]: 2 };

			expect(hasOwn(obj, 'a')).toBe(true);
			expect(hasOwn(obj, s)).toBe(true);
		});

		it('hasOwn without Object.hasOwn', async () => {
			const _v = Object.hasOwn;
			// @ts-expect-error
			Object.hasOwn = undefined;

			const hasOwn = (await import('@/object')).hasOwn;

			const s = Symbol('s');
			const obj = { a: 1, [s]: 2 };

			expect(hasOwn(obj, 'a')).toBe(true);
			expect(hasOwn(obj, s)).toBe(true);

			Object.hasOwn = _v;
		});

		it('hasOwn in no prototype', async () => {
			const _v = Object.hasOwn;
			// @ts-expect-error
			Object.hasOwn = undefined;

			const hasOwn = (await import('@/object')).hasOwn;

			const s = Symbol('s');
			const obj = Object.create(null);
			obj.a = 1;
			obj[s] = 2;

			expect(hasOwn(obj, 'a')).toBe(true);
			expect(hasOwn(obj, s)).toBe(true);

			Object.hasOwn = _v;
		});

		it('hasOwn in no iterator', async () => {
			const _v = Object.hasOwn;
			// @ts-expect-error
			Object.hasOwn = undefined;

			const hasOwn = (await import('@/object')).hasOwn;

			const s = Symbol('s');
			const obj = Object.create(null, {
				a: { value: 1 },
				[s]: { value: 2 },
			});

			expect(hasOwn(obj, 'a')).toBe(true);
			expect(hasOwn(obj, s)).toBe(true);

			Object.hasOwn = _v;
		});
	});

	describe('object property', () => {
		it('hasProp', () => {
			const obj = { a: { b: 1 }, c: [3] };
			expect(hasProp(obj, 'a')).toBe(true);
			expect(hasProp(obj, 'a.b')).toBe(true);
			expect(hasProp(obj, 'c')).toBe(true);
			expect(hasProp(obj, 'c.0')).toBe(true);
		});

		it('getProp', () => {
			const obj = { a: { b: 1 }, c: [3] };
			expect(getProp(obj, 'a')).toEqual({ b: 1 });
			expect(getProp(obj, 'a.b')).toBe(1);
			expect(getProp(obj, 'c')).toEqual([3]);
			expect(getProp(obj, 'c.0')).toBe(3);
		});

		it('objectKeys', () => {
			const obj = { a: { b: 1 }, c: [3] };
			expect(objectKeys(obj)).toEqual(['a', 'c']);
			const obj2 = {};
			expect(objectKeys(obj2)).toEqual([]);
		});

		it('isKeyOf', () => {
			const obj = { a: { b: 1 }, c: [3] };
			expect(isKeyOf(obj, 'a')).toBe(true);
			expect(isKeyOf(obj, 'hasOwnProperty')).toBe(true);
			expect(isKeyOf(obj, 'd')).toBe(false);
			expect(isKeyOf(obj, 'c')).toBe(true);
			expect(isKeyOf(obj, 'toString')).toBe(true);
		});
	});

	describe('other funcs', () => {
		it('inEnum', () => {
			enum E {
				A = 'a',
				B = 'b',
			}
			expect(inEnum(E, 'a')).toBe(true);
			expect(inEnum(E, 'b')).toBe(true);
			expect(inEnum(E, 'A')).toBe(false);
			const A = E.A as string;
			if (inEnum(E, A)) {
				expectTypeOf(A).toMatchTypeOf<E>();
			} else {
				expectTypeOf(A).not.toMatchTypeOf<E>();
			}
		});

		it('objectPick', () => {
			const obj = { a: { b: 1 }, c: 2, d: void 0 } as const;
			const a1 = objectPick(obj, 'a');
			const a2 = objectPick.omitUndefined(obj, 'a');
			expect(a1).toEqual({ a: { b: 1 } });
			expect(a2).toEqual({ a: { b: 1 } });
			expectTypeOf(a1).toMatchTypeOf<{ a: { b: 1 } }>();

			const b1 = objectPick(obj, 'c');
			expect(b1).toEqual({ c: 2 });
			expectTypeOf(b1).toMatchTypeOf<{ c: 2 }>();

			const c1 = objectPick(obj, 'd');
			const c2 = objectPick.omitUndefined(obj, 'd');
			expect(c1).toEqual({ d: void 0 });
			expect(c2).toEqual({});
			expectTypeOf(c1).toMatchTypeOf<{ d: undefined }>();
			expectTypeOf(c2).toMatchTypeOf<{}>();
		});
	});
});
