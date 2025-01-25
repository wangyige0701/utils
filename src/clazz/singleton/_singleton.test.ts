import type { Constructor } from '@/types';
import { describe, it, expect, expectTypeOf } from 'vitest';
import { singleton } from '@/clazz';

describe('singleton use globalThis.Proxy', () => {
	it('singleton', () => {
		class A {
			#data = 1;
			constructor(a: number) {
				this.#data = a;
			}
			get data() {
				return this.#data;
			}
			use() {
				return this.#data;
			}
		}
		const a = new A(1);
		const B = singleton(A);
		const a1 = new B(2);
		const a2 = new B(2);
		const C = a1.constructor as Constructor<A, [number]>;
		const a3 = new C(2);

		expect(a === a1).toBe(false);
		expect(a1 === a2).toBe(true);
		expect(a1 === a3).toBe(true);
		expect(a1.data).toBe(2);
		expect(a2.data).toBe(2);
		expect(a3.use()).toBe(2);
		expectTypeOf(a1).toMatchTypeOf<A>();
		expectTypeOf(a2).toMatchTypeOf<A>();
		expectTypeOf(a3).toMatchTypeOf<A>();
	});

	it('singleton with default params', () => {
		class A {
			constructor(a: number, b: string = 'hello') {}
			use() {}
		}
		const ASingleton = singleton(A, 2);
		const a1 = new ASingleton('s');
		const a2 = new ASingleton('s');

		expect(a1 === a2).toBe(true);
		expectTypeOf(a1).toMatchTypeOf<A>();
		expectTypeOf(a2).toMatchTypeOf<A>();
	});

	it('singleton with constructor', () => {
		class A {}
		const ASingleton = singleton(A);
		expect(ASingleton.prototype.constructor === ASingleton).toBe(true);
	});
});
