import type { ElementOf, Fn, JoinElements } from '@/types';
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
	let _separator = '';
	const joinElements = <T extends Array<string | number>>(
		...args: T
	): JoinElements<T> => {
		return args.map(_toString).join(_separator) as JoinElements<T>;
	};
	joinElements.separate = <S extends string>(separator: S) => {
		if (!isString(separator)) {
			throw new Error(`Invalid argument ${separator}, must be a string`);
		}
		_separator = separator;
		return <T extends Array<string | number>>(
			...args: T
		): JoinElements<T, S> => {
			return joinElements(...args) as JoinElements<T, S>;
		};
	};
	return joinElements;
})();

export function at<T>(arr: readonly [], index: number): undefined;
export function at<T>(arr: readonly T[], index: number): T;
export function at<T>(arr: readonly T[], index: number): T | undefined {
	const len = arr.length;
	if (!len) {
		return void 0;
	}
	if (index < 0) {
		index += len;
	}
	return arr[index];
}

export function last<T>(arr: readonly []): undefined;
export function last<T>(arr: readonly T[]): T;
export function last<T>(arr: readonly T[]): T | undefined {
	return at(arr, -1);
}

export function first<T>(arr: readonly []): undefined;
export function first<T>(arr: readonly T[]): T;
export function first<T>(arr: readonly T[]): T | undefined {
	return at(arr, 0);
}

export async function asyncForeach<T extends any[]>(
	arr: T,
	fn: Fn<[ElementOf<T>], PromiseLike<any>>,
) {
	const result = [];
	for (const item of arr) {
		result.push(await fn(item));
	}
	return result;
}

/**
 * Remove elements from array
 */
export function arrayRemove(arr: any[], ...items: any[]) {
	for (const i of items) {
		const index = arr.indexOf(i);
		if (index > -1) {
			arr.splice(index, 1);
		}
	}
}

/**
 * Remove duplicates from array
 */
export function arrayUnique<T>(arr: T[]): T[] {
	return arr.reduce((prev, curr) => {
		if (!prev.includes(curr)) {
			prev.push(curr);
		}
		return prev;
	}, [] as T[]);
}
