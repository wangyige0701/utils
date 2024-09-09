import type { ExtractRest, Fn, ElementsOptional } from '@/types';

type CurryFunction = Fn<[...args: any[]], any>;

type CurryResult<
	F extends CurryFunction,
	P = Parameters<F>,
	R = ReturnType<F>,
> = P extends []
	? Fn<[], R>
	: P extends [infer Param]
		? (arg: Param) => R
		: P extends [infer Param, ...infer Rest]
			? (arg: Param) => CurryResult<Fn<Rest, R>>
			: never;

export function curry<F extends CurryFunction>(fn: F): CurryResult<F> {
	return <CurryResult<F>>function (param: any) {
		if (fn.length <= 1) {
			return fn(param);
		} else {
			return curry(fn.bind(null, param));
		}
	};
}

type AnyCurryResult<
	F extends CurryFunction,
	P = Parameters<F>,
	R = ReturnType<F>,
> = P extends []
	? Fn<[], R>
	: P extends any[]
		? <Params extends ElementsOptional<P>>(
				...args: Params
			) => Params['length'] extends P['length']
				? R
				: AnyCurryResult<Fn<ExtractRest<Params['length'], P>, R>>
		: never;

/**
 * Create a curry function which can setting any length params.
 * @example
 * ```ts
 * function a(a: number, b: string, c: boolean) {
 * 	return a + b + c;
 * }
 * const result = anyCurry(a);
 * result(1, '2')(false) // => '12false'
 * ```
 */
export function anyCurry<F extends CurryFunction>(fn: F): AnyCurryResult<F> {
	return <AnyCurryResult<F>>function (...params: any[]) {
		if (params.length >= fn.length) {
			return fn(...params);
		} else {
			return anyCurry(fn.bind(null, ...params));
		}
	};
}
