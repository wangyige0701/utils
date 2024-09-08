import type { PreElements } from '@/types';
import { isArray, isBoolean, isObject, isRegExp } from '@/is';

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
 * Convert to effective number, if result is NaN, return 0
 */
export function toNumber(val: any): number {
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

/**
 * Merge the inputs to a full regexp, if the length of input upper than one,
 * the last param can be parse to regexp flag
 */
export const toRegExp = (() => {
	type Flag = ('g' | 'i' | 'm' | 's' | 'u' | 'y') | {};
	type Params<T extends Array<string | RegExp>> = T['length'] extends 0
		? []
		: T['length'] extends 1
			? T
			: [...PreElements<T>, RegExp | Flag];

	const flags = ['g', 'i', 'm', 's', 'u', 'y'];
	function _parse(rgx: string | RegExp): string {
		if (isRegExp(rgx)) {
			const str = rgx.toString();
			return str.slice(1, str.lastIndexOf('/'));
		}
		return rgx.toString();
	}
	return function <T extends Array<string | RegExp>>(
		...vals: Params<T>
	): RegExp {
		if (vals.length === 0) {
			return new RegExp('');
		}
		const str = vals
			.map(val => _parse(val as string | RegExp))
			.filter(Boolean);
		const flag = str.length > 1 ? str.pop()! : '';
		if (flag) {
			if (!flags.includes(flag)) {
				str.push(flag);
			} else {
				return new RegExp(str.join(''), flag);
			}
		}
		return new RegExp(str.join(''));
	};
})();
