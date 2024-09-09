import { describe, expectTypeOf, it } from 'vitest';
import type {
	Arrayable,
	Awaitable,
	Nullable,
	Fn,
	AwaitableFn,
	Constructor,
	Elementof,
	PromiseResolve,
	PromiseReject,
	PickValues,
	OmitValues,
	Optional,
	PartialOptional,
	Writable,
	DeepPartial,
	DeepRequired,
	FirstElement,
	LastElement,
	PreElements,
	RestElements,
	ElementsOptional,
	ExtractElements,
	ExtractRest,
} from '.';

describe('type check', () => {
	const promiseLike = <T>(val: T) => ({
		then: <TResult1 = T, TResult2 = never>(
			onfulfilled:
				| ((value: T) => TResult1 | PromiseLike<TResult1>)
				| undefined
				| null,
			onrejected?:
				| ((reason: any) => TResult2 | PromiseLike<TResult2>)
				| undefined
				| null,
		): PromiseLike<TResult1 | TResult2> => {
			try {
				return Promise.resolve(
					onfulfilled?.(val) ?? (val as unknown as TResult1),
				);
			} catch (error) {
				return Promise.reject(onrejected?.(error));
			}
		},
	});

	it('Arrayable', () => {
		expectTypeOf(1).toMatchTypeOf<Arrayable<number>>();
		expectTypeOf([1, 2, 3]).toMatchTypeOf<Arrayable<number>>();
	});

	it('Awaitable', () => {
		expectTypeOf(1).toMatchTypeOf<Awaitable<number>>();
		expectTypeOf(Promise.resolve(1)).toMatchTypeOf<Awaitable<number>>();
		expectTypeOf(promiseLike(1)).toMatchTypeOf<Awaitable<number>>();
	});

	it('Nullable', () => {
		function test<T>(a: T, time = 1) {
			if (time === 1) {
				return a;
			} else if (time === 2) {
				return null;
			} else {
				return undefined;
			}
		}
		expectTypeOf(test(1)).toMatchTypeOf<Nullable<number>>();
	});

	it('Fn', () => {
		const testA = () => 1;
		type A = Fn<[], number>;
		expectTypeOf(testA).toMatchTypeOf<A>();
		expectTypeOf(testA).returns.toMatchTypeOf<ReturnType<A>>();

		const testB = (a: number, b: string, c: boolean) => a + b + c;
		type B = Fn<[a: number, b: string, c: boolean], string>;
		expectTypeOf(testB).toMatchTypeOf<B>();
		expectTypeOf(testB).parameters.toMatchTypeOf<Parameters<B>>();
		expectTypeOf(testB).returns.toMatchTypeOf<ReturnType<B>>();
	});

	it('AwaitableFn', () => {
		expectTypeOf(() => 1).toMatchTypeOf<AwaitableFn<Fn<[], number>>>();
		expectTypeOf(async () => 1).toMatchTypeOf<
			AwaitableFn<Fn<[], number>>
		>();

		{
			const test1: AwaitableFn<Fn<[], number>> = () => 1;
			const test2: Fn<[], number> = () => 1;
			async () => {
				await test1();
				await test2(); // warning
			};
		}
	});

	it('Constructor', () => {
		class TestA {
			constructor() {}
		}
		type A = Constructor<TestA>;
		expectTypeOf(TestA).toMatchTypeOf<A>();

		class TestB {
			constructor(a: number, b: string, c: boolean) {}
		}
		type B = Constructor<TestB, [a: number, b: string, c: boolean]>;
		expectTypeOf(TestB).toMatchTypeOf<B>();
	});

	it('Elementof', () => {
		const testA = [1, 2, 3, 4];
		type A = Elementof<typeof testA>;
		expectTypeOf(1).toMatchTypeOf<A>();
	});

	it('PromiseResolve', () => {
		type A = PromiseResolve;
		expectTypeOf(Promise.resolve).toMatchTypeOf<A>();
	});

	it('PromiseReject', () => {
		type A = PromiseReject;
		expectTypeOf(Promise.reject).toMatchTypeOf<A>();
	});

	it('PickValues', () => {
		type TestA = { a: number; b: string; c: boolean };
		type A = PickValues<TestA, string | number>;
		expectTypeOf<{
			a: number;
			b: string;
			c?: boolean;
		}>().toMatchTypeOf<A>();
	});

	it('OmitValues', () => {
		type TestA = { a: number; b: string; c: boolean };
		type A = OmitValues<TestA, string | number>;
		expectTypeOf<{
			a?: number;
			b?: string;
			c: boolean;
		}>().toMatchTypeOf<A>();
	});

	it('Optional', () => {
		type TestA = { a: number; b: string; c: boolean };
		type A = Optional<TestA, 'a' | 'c'>;
		expectTypeOf<{
			a?: number;
			b: string;
			c?: boolean;
		}>().toMatchTypeOf<A>();
	});

	it('PartialOptional', () => {
		type TestA = { a: number; b?: string; c?: boolean };
		type A = PartialOptional<TestA, 'a' | 'c'>;
		expectTypeOf<{
			a?: number;
			b: string;
			c?: boolean;
		}>().toMatchTypeOf<A>();
	});

	it('Writable', () => {
		type TestA = {
			readonly a: number;
			readonly b?: string;
			readonly c: boolean;
		};
		type A = Writable<TestA>;
		expectTypeOf<A>().toMatchTypeOf<{
			a: number;
			b?: string;
			c: boolean;
		}>();
	});

	it('DeepPartial', () => {
		type TestA = { a: number; b: { c: string } };
		type A = DeepPartial<TestA>;
		expectTypeOf<A>().toMatchTypeOf<{ a?: number; b?: { c?: string } }>();
	});

	it('DeepRequired', () => {
		type TestA = { a?: number; b: { c?: string; d: boolean } };
		type A = DeepRequired<TestA>;
		expectTypeOf<{
			a: number;
			b: { c: string; d: boolean };
		}>().toMatchTypeOf<A>();
	});

	it('FirstElement', () => {
		type TestA = [number, string, boolean];
		type A = FirstElement<TestA>;
		expectTypeOf(2).toMatchTypeOf<A>();

		type TestB = [];
		type B = FirstElement<TestB>;
		expectTypeOf<undefined>().toMatchTypeOf<B>();

		type TestC = [string[]];
		type C = FirstElement<TestC>;
		expectTypeOf(['a']).toMatchTypeOf<C>();
	});

	it('LastElement', () => {
		type TestA = [number, string, boolean];
		type A = LastElement<TestA>;
		expectTypeOf(true).toMatchTypeOf<A>;

		type TestB = [];
		type B = FirstElement<TestB>;
		expectTypeOf<undefined>().toMatchTypeOf<B>();

		type TestC = [string[]];
		type C = FirstElement<TestC>;
		expectTypeOf(['a']).toMatchTypeOf<C>();
	});

	it('PreElements', () => {
		type TestA = [number, string, boolean];
		type A = PreElements<TestA>;
		expectTypeOf<[number, string]>().toMatchTypeOf<A>();

		type TestB = [];
		type B = PreElements<TestB>;
		expectTypeOf<[]>().toMatchTypeOf<B>();

		type TestC = [string];
		type C = PreElements<TestC>;
		expectTypeOf<[]>().toMatchTypeOf<C>();
	});

	it('RestElements', () => {
		type TestA = [number, string, boolean];
		type A = RestElements<TestA>;
		expectTypeOf<[string, boolean]>().toMatchTypeOf<A>();

		type TestB = [];
		type B = RestElements<TestB>;
		expectTypeOf<[]>().toMatchTypeOf<B>();

		type TestC = [string];
		type C = RestElements<TestC>;
		expectTypeOf<[]>().toMatchTypeOf<C>();
	});

	it('ElementsOptional', () => {
		function test(a: number, b: string, c: boolean) {}
		type A = ElementsOptional<Parameters<typeof test>>;
		expectTypeOf<[number?, string?, boolean?]>().toMatchTypeOf<A>();
	});

	it('ExtractElements', () => {
		type TestA = [number, string, boolean];
		type A = ExtractElements<2, TestA>;
		expectTypeOf<[number, string]>().toMatchTypeOf<A>();

		type TestB = [];
		type B = ExtractElements<2, TestB>;
		expectTypeOf<[undefined, undefined]>().toMatchTypeOf<B>();
	});

	it('ExtractRest', () => {
		type TestA = [number, string, boolean];
		type A = ExtractRest<2, TestA>;
		expectTypeOf<[boolean]>().toMatchTypeOf<A>();

		type TestB = [];
		type B = ExtractRest<2, TestB>;
		expectTypeOf<[]>().toMatchTypeOf<B>();
	});
});
