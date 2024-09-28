import type { Fn } from '@/types';
import { describe, it, expect } from 'vitest';
import { UseStack } from '@/useful';

describe('useStack', () => {
	it('should get correct direction', () => {
		const stack = new UseStack<string>();
		stack.push('a');
		stack.push('b');
		expect(stack.pop).toBe('b');
		stack.push('c');
		expect(stack.pop).toBe('c');
		expect(stack.pop).toBe('a');
		expect(stack.pop).toBeUndefined();
		stack.push('d');
		stack.push('e');
		stack.push('f');
		stack.clear();
		expect(stack.pop).toBeUndefined();
	});

	it('should use pop as function', () => {
		const stack = new UseStack<Fn<[boolean], number>>();
		stack.push(() => 1);
		stack.push(() => 2);
		expect(stack.pop!(true)).toBe(2);
		expect(stack.pop!(true)).toBe(1);
	});
});
