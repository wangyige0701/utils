import type { ExtractRest, Fn, ElementsOptional } from '@/types';

type CurryFunction = Fn<[...args: any[]], any>;

type CurryResult<
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
				: CurryResult<Fn<ExtractRest<Params['length'], P>, R>>
		: never;

export function curry<F extends CurryFunction>(fn: F): CurryResult<F> {
	return <CurryResult<F>>function <P extends any[]>(...params: P) {
		if (params.length >= fn.length) {
			return fn(...params);
		} else {
			return curry(fn.bind(null, ...params));
		}
	};
}
