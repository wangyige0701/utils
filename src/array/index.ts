import type { JoinElements } from '@/types';
import { isNumber, isString } from '@/is';

export const VOID_ARRAY = Object.freeze([]) as [];

/**
 * Join elements of an array, which element must be a string or number.
 */
export const joinElements = (() => {
	function _toString(val: string | number): string {
		if (isNumber(val)) {
			return val.toString();
		}
		if (isString(val)) {
			return val;
		}
		throw new Error(`Invalid argument ${val}, must be a string or number`);
	}
	return function joinElements<T extends Array<string | number>>(
		...args: T
	): JoinElements<T> {
		return args.map(_toString).join('') as JoinElements<T>;
	};
})();
