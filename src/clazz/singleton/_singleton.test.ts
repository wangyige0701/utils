import type { Constructor } from '@/types';
import { describe, it, expect } from 'vitest';
import { singleton } from '@/clazz';

describe('singleton use globalThis.Proxy', () => {
	it('singleton', () => {
		class A {
			constructor(a: number) {}
		}
		const a = new A(1);
		const B = singleton(A);
		const a1 = new B(2);
		const a2 = new B(2);
		const C = a1.constructor as Constructor<typeof A, [number]>;
		const a3 = new C(2);

		expect(a === a1).toBe(false);
		expect(a1 === a2).toBe(true);
		expect(a1 === a3).toBe(true);
	});

	it('singleton with default params', () => {
		class A {
			constructor(a: number, b: string = 'hello') {}
		}
		const ASingleton = singleton(A, 2);
		const a1 = new ASingleton('s');
		const a2 = new ASingleton('s');

		expect(a1 === a2).toBe(true);
	});
});
