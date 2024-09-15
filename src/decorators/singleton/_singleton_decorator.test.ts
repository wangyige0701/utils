import { describe, it, expect } from 'vitest';
import { Singleton } from '@/decorators';

describe('Singleton Decorator', () => {
	it('should create a singleton instance', () => {
		@Singleton()
		class A {
			constructor(a: number) {
				console.log(a);
			}
		}

		const a = new A(1);
		const b = new A(1);

		expect(a === b).toBe(true);
	});
});
