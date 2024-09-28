import type { Fn } from '@/types';
import { describe, it, expect } from 'vitest';
import { UseQueue } from '@/useful';

describe('useQueue', () => {
	it('should get correct direction', () => {
		const queue = new UseQueue<string>();
		queue.enQueue('a');
		queue.enQueue('b');
		expect(queue.deQueue).toBe('a');
		queue.enQueue('c');
		expect(queue.deQueue).toBe('b');
		expect(queue.deQueue).toBe('c');
		expect(queue.deQueue).toBeUndefined();
		queue.enQueue('d');
		queue.enQueue('e');
		queue.enQueue('f');
		queue.clear();
		expect(queue.deQueue).toBeUndefined();
	});

	it('should use deQueue as function', () => {
		const queue = new UseQueue<Fn<[boolean], string>>();
		queue.enQueue(b => 'a');
		queue.enQueue(b => 'b');
		expect(queue.deQueue!(true)).toBe('a');
		expect(queue.deQueue!(true)).toBe('b');
	});
});
