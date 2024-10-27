import { isArray, isBoolean, isObject, isString } from '@/is';

/**
 * Use `JSON.stringify` for object and array,
 * the rest use String constructor to convert
 */
export function toString(val: any): string {
	if (isObject(val) || isArray(val)) {
		return JSON.stringify(val);
	}
	return String(val);
}

/**
 * Convert to effective number, if result is NaN, return 0.
 * - For string, use `parseFloat` to convert
 * - For object, use `parseFloat` to convert
 * @example
 * ```ts
 * toNumber([1,2,3]); // 1
 * ```
 * - The rest use `Number` constructor to convert
 */
export function toNumber(val: any): number {
	if (isString(val) || typeof val === 'object') {
		return parseFloat(val) || 0;
	}
	return Number(val) || 0;
}

/**
 * Boolean is directly return, if type is string and value is 'true' or 'false', return true or false,
 * the rest use Boolean constructor to convert
 */
export function toBoolean(val: any): boolean {
	if (isBoolean(val)) {
		return val;
	}
	if (val === 'true') {
		return true;
	}
	if (val === 'false') {
		return false;
	}
	return Boolean(val);
}

export function toArray<T>(val: T | T[]): T[] {
	if (isArray(val)) {
		return val;
	}
	return [val];
}
