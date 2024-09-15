import type { ElementOf, Fn, LastElement } from '@/types';
import { isFunction } from '@/is';

type PipeParams = Array<Fn<[any], any>>;

type PipeFirstParam<T extends PipeParams> = T[0] extends undefined
	? undefined
	: T[0] extends Fn<[infer P], any>
		? P
		: any;

type PipeResult<T extends PipeParams, Last = LastElement<T>> =
	Last extends ElementOf<PipeParams> ? ReturnType<Last> : never;

type PipeReturn<T extends PipeParams> = (
	param: PipeFirstParam<T>,
) => PipeResult<T>;

export function pipe<T extends PipeParams>(...funs: T): PipeReturn<T> {
	if (funs.some(f => !isFunction(f))) {
		throw new Error('All arguments must be function');
	}
	return function (param: PipeFirstParam<T>) {
		return funs.reduce((prev, f) => {
			return f(prev);
		}, param) as PipeResult<T>;
	};
}
