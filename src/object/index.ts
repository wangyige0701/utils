import type { Fn, OmitValues, Values } from '@/types';
import { isFunction, isNull, isString, isSymbol, isUndefined } from '@/is';
import { splitByPoint } from '@/string';
import { toArray } from '@/to';

// objectKeys
export * from './object-keys';

export const VOID_OBJECT = Object.freeze({}) as {};

/**
 * Check if the own property in object has give properties.
 * If `Object.hasOwn` and `Object.getOwnPropertyNames` are not supported,
 * will use `in` to check, and it will contain extend properties.
 */
export const hasOwn = (() => {
	let _use: Fn<[o: object, prop: PropertyKey], boolean>;
	if (isFunction(Object.hasOwn)) {
		_use = Object.hasOwn;
	} else {
		let _symbol: Fn<[o: object, prop: symbol], boolean>;
		let _key: Fn<[o: object, prop: string | number], boolean>;
		if (isFunction(Object.getOwnPropertySymbols)) {
			_symbol = (o, prop) =>
				Object.getOwnPropertySymbols(o).includes(prop);
		} else {
			_symbol = (o, prop) => prop in o;
		}
		if (isFunction(Object.getOwnPropertyNames)) {
			_key = (o, prop) =>
				Object.getOwnPropertyNames(o).includes(String(prop));
		} else {
			_key = (o, prop) => prop in o;
		}
		_use = (o, prop) => {
			if (o instanceof Object) {
				return Object.prototype.hasOwnProperty.call(o, prop);
			} else {
				if (isSymbol(prop)) {
					return _symbol(o, prop);
				} else {
					return _key(o, prop);
				}
			}
		};
	}
	return function hasOwn(o: object, prop: PropertyKey): boolean {
		if (isNull(o)) {
			return false;
		}
		return _use(o, prop);
	};
})();

/**
 * Check if object has give property,
 * and the property can use point notation.
 */
export function hasProp(o: object, prop: string) {
	if (!isString(prop)) {
		throw new Error("'prop' must be string");
	}
	let obj: any = o;
	const iterator = splitByPoint.iterator(prop);
	for (const key of iterator) {
		if (!hasOwn(obj, key)) {
			return false;
		}
		obj = obj[key];
	}
	return true;
}

/**
 * Get the value in the object by property which property can use point notation.
 */
export function getProp(o: object, prop: string) {
	if (!isString(prop)) {
		throw new Error("'prop' must be string");
	}
	let obj: any = o;
	let result: any;
	const iterator = splitByPoint.iterator(prop);
	for (const key of iterator) {
		if (!hasOwn(obj, key)) {
			return;
		}
		obj = obj[key];
		result = obj;
	}
	return result;
}

/**
 * Use `in` keyword to check whether the key is in the object.
 */
export function isKeyOf<T extends object>(o: T, k: any): k is keyof T {
	return k in o;
}

/**
 * Check whether the value is in the enum object,
 * use `Object.values` to get the values of the object.
 */
export function inEnum<T extends object>(o: T, k: any): k is Values<T> & {} {
	return Object.values(o).includes(k);
}

/**
 * Pick giv properties from the object.
 * If use `omitUndefined` function, the result will filter undefined values.
 *
 * @example
 * ```ts
 * const a = { a: 1, b: 2, c: undefined };
 *
 * objectPick(a, 'a', 'c') // { a: 1, c: undefined }
 * objectPick.omitUndefined(a, 'a', 'c') // { a: 1 }
 *
 * ```
 */
export const objectPick = (() => {
	function _pick<T extends object, K extends keyof T>(
		o: T,
		keys: K[],
		omit: true,
	): OmitValues<Pick<T, K>, undefined>;
	function _pick<T extends object, K extends keyof T>(
		o: T,
		keys: K[],
		omit?: false,
	): Pick<T, K>;
	function _pick<T extends object, K extends keyof T>(
		o: T,
		keys: K[],
		omit: boolean = false,
	) {
		return keys.reduce(
			(prev, curr) => {
				if (curr in o) {
					if (!omit || !isUndefined(o[curr])) {
						prev[curr] = o[curr];
					}
				}
				return prev;
			},
			{} as Pick<T, K>,
		);
	}
	const objectPick = <T extends object, K extends keyof T>(
		o: T,
		keys: K | K[],
	) => _pick(o, toArray(keys), false);
	objectPick.omitUndefined = <T extends object, K extends keyof T>(
		o: T,
		keys: K | K[],
	) => _pick(o, toArray(keys), true);
	return objectPick;
})();
