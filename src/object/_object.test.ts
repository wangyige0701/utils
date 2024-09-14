import { describe, it, expect } from 'vitest';
import { hasProp, getProp } from '@/object';

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
});
