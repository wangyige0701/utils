import type { Fn } from '@/types';
import { isFunction, isNumber, isRegExp, isString, isUndefined } from '@/is';

/**
 * Create a range iterator
 * @param start
 * @param end
 * @param step must be positive
 */
export function range(
	start: number,
	end: number,
	step?: number,
): IterableIterator<number>;
export function range(end: number): IterableIterator<number>;
export function* range(start: number, end?: number, step: number = 1) {
	if (isUndefined(end)) {
		end = start;
		start = 0;
	}
	if (!isNumber(step)) {
		throw new TypeError('step must be a number');
	}
	if (step <= 0) {
		throw new RangeError('step must be a positive number');
	}
	const direction = end - start > 0 ? 1 : -1;
	step = Math.max(Math.abs(step), 1) * direction;
	for (let i = start; i * direction < end * direction; i += step) {
		yield i;
	}
}

/**
 * Split string by give rule, and return an iterator
 * @param use A string, regex or a function. When a function is given, the first param is the step string;
 * the second param is a callback function, which passing the length of match string, and is zero when void.
 * @param cb Call when yield the string
 */
export function* splitString<T = string>(
	str: string,
	use: string | RegExp | Fn<[inner: string, cb: Fn<[num?: number]>]>,
	cb?: Fn<[s: string], T>,
) {
	if (!isString(str)) {
		throw new TypeError('First param must be a string');
	}
	function collect(fn: Fn<[string, Fn<[num?: number]>]>) {
		return (s: string) => {
			const result = { value: false, number: 0 };
			fn(s, (num: number = 0) => {
				result.value = true;
				result.number = num;
			});
			return result;
		};
	}
	let splitBy = use;
	if (!isFunction(splitBy)) {
		if (!isString(splitBy) && !isRegExp(splitBy)) {
			throw new TypeError(
				'Second param must be a string or a RegExp or a function which return value is boolean',
			);
		}
		splitBy = isString(use)
			? (s: string, cb: Fn<[num?: number]>) => s === use && cb()
			: (s: string, cb: Fn<[num?: number]>) => {
					const match = s.match(use as RegExp);
					match && cb(match[1]?.length);
				};
	}
	if (!isFunction(cb)) {
		cb = (s: string) => s as T;
	}
	const length = str.length;
	const check = collect(splitBy);
	const toCheck = (
		start: number,
		end: number,
		len: number = 0,
		floor: number = 1,
	) => {
		if (end > length) {
			return false;
		}
		const char = str.slice(start, end);
		const result = check(char);
		if (result.value) {
			return toCheck(start, end + 1, result.number, floor + 1);
		}
		if (floor > 1) {
			return [end - 1, len];
		}
		return false;
	};
	let val = '';
	for (let i = 0; i < length; i++) {
		const result = toCheck(i, i + 1);
		if (result === false) {
			val += str[i];
			continue;
		}
		const [end, len] = result;
		if (val) {
			yield cb(val);
		}
		val = str.slice(i, i + len);
		i = end - 1;
	}
	if (val) {
		yield cb(val);
	}
}
