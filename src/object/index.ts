import type { Fn } from '@/types';
import { isFunction, isString, isSymbol } from '@/is';
import { splitByPoint } from '@/string';

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
