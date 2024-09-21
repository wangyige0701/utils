import { describe, it, expect } from 'vitest';
import { range, splitString } from '@/iterator';

describe('Iterator', () => {
	it('range', () => {
		{
			const iterator = range(5);
			const check = [...iterator];
			expect(check).toEqual([0, 1, 2, 3, 4]);
		}
		{
			const iterator = range(0, 10, 2);
			const check = [...iterator];
			expect(check).toEqual([0, 2, 4, 6, 8]);
		}
		{
			const iterator = range(6, 0, 1);
			const check = [...iterator];
			expect(check).toEqual([6, 5, 4, 3, 2, 1]);
		}
		{
			const iterator = range(0, -5, 3);
			const check = [...iterator];
			console.log(check);
			expect(check).toEqual([0, -3]);
		}
	});

	it('splitString', () => {
		{
			const iterator = splitString('hello  world', /\s+/);
			expect(iterator.next()).toEqual({ value: 'hello', done: false });
			expect(iterator.next()).toEqual({ value: 'world', done: false });
			expect(iterator.next()).toEqual({ value: undefined, done: true });
		}
		{
			const iterator = splitString('hello     world   you  ', /\s+/g);
			expect(iterator.next()).toEqual({ value: 'hello', done: false });
			expect(iterator.next()).toEqual({ value: 'world', done: false });
			expect(iterator.next()).toEqual({ value: 'you', done: false });
			expect(iterator.next()).toEqual({ value: undefined, done: true });
		}
		{
			const iterator = splitString('hello-world', '-');
			expect(iterator.next()).toEqual({ value: 'hello', done: false });
			expect(iterator.next()).toEqual({ value: 'world', done: false });
			expect(iterator.next()).toEqual({ value: undefined, done: true });
		}
		{
			const iterator = splitString('hello---world', /\-+/);
			expect(iterator.next()).toEqual({ value: 'hello', done: false });
			expect(iterator.next()).toEqual({ value: 'world', done: false });
			expect(iterator.next()).toEqual({ value: undefined, done: true });
		}
		{
			const iterator = splitString('SayHelloWorld', /[A-Z]/, false);
			expect(iterator.next()).toEqual({ value: 'Say', done: false });
			expect(iterator.next()).toEqual({ value: 'Hello', done: false });
			expect(iterator.next()).toEqual({ value: 'World', done: false });
			expect(iterator.next()).toEqual({ value: undefined, done: true });
		}
		{
			const iterator = splitString(
				'a12b12c234',
				(str, index, origin, collect) => {
					if (str === 'c') {
						return collect(1, false);
					}
				},
			);
			expect(iterator.next()).toEqual({ value: 'a12b12', done: false });
			expect(iterator.next()).toEqual({ value: 'c234', done: false });
			expect(iterator.next()).toEqual({ value: undefined, done: true });
		}
		{
			const iterator = splitString(
				'123abc456efg567aaa',
				/(abc)|(efg)|(aaa)/,
			);
			expect(iterator.next()).toEqual({ value: '123', done: false });
			expect(iterator.next()).toEqual({ value: '456', done: false });
			expect(iterator.next()).toEqual({ value: '567', done: false });
			expect(iterator.next()).toEqual({ value: undefined, done: true });
		}
	});
});
