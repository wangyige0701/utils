import { describe, it, expect, vi } from 'vitest';
import { singleton } from '.';
import { Constructor } from '@/types';

describe('clazz', () => {
	it('singleton', () => {
		class A {
			constructor(a: number) {}
		}
		const a = new A(1);
		const B = singleton(A);
		const a1 = new B(2);
		const a2 = new B(2);
		const C = a1.constructor as Constructor<typeof A>;
		const a3 = new C(2);

		expect(a === a1).toBe(false);
		expect(a1 === a2).toBe(true);
		expect(a1 === a3).toBe(true);
	});

	it('singleton without proxy', () => {
		vi.stubGlobal('Proxy', undefined);

		class A {
			constructor(a: number) {}
		}
		const a = new A(1);
		const B = singleton(A);
		const a1 = new B(2);
		const a2 = new B(2);
		const C = a1.constructor as Constructor<typeof A>;
		const a3 = new C(2);

		expect(a === a1).toBe(false);
		expect(a1 === a2).toBe(true);
		expect(a1 === a3).toBe(true);

		vi.unstubAllGlobals();
	});
});
