import { toPrimitiveString as toString } from '@/prototype';

export function isString(val: any): val is string {
	return typeof val === 'string';
}

export function isNumber(val: any): val is number {
	return typeof val === 'number';
}

export function isBoolean(val: any): val is boolean {
	return typeof val === 'boolean';
}

export function isFunction(val: any): val is Function {
	return typeof val === 'function';
}

export const isArray = (() => {
	if (isFunction(Array.isArray)) {
		return function isArray<T = any>(val: any): val is Array<T> {
			return Array.isArray(val);
		};
	}
	return function isArray<T = any>(val: any): val is Array<T> {
		return toString(val) === '[object Array]';
	};
})();

export function isObject<T = any>(val: any): val is Record<string, T> {
	return toString(val) === '[object Object]';
}

/**
 * Use typeof to determine if the value is an object,
 * but exclude null, like Object, Array, Date, etc.
 */
export function isGeneralObject(val: any): val is object {
	return typeof val === 'object' && !isNull(val);
}

export function isUndefined(val: any): val is undefined {
	return typeof val === 'undefined';
}

export function isNull(val: any): val is null {
	return val === null;
}

export function isDef<T>(val: T): val is NonNullable<T> {
	return !isUndefined(val) && !isNull(val);
}

export function isUndef(v: any): v is undefined | null {
	return isUndefined(v) || isNull(v);
}

export function isSymbol(val: any): val is symbol {
	return typeof val === 'symbol';
}

export function isDate(val: any): val is Date {
	return toString(val) === '[object Date]';
}

export function isRegExp(val: any): val is RegExp {
	return toString(val) === '[object RegExp]';
}

export function isBigint(val: any): val is bigint {
	return typeof val === 'bigint';
}

export function isPromise<T = any>(val: any): val is Promise<T> {
	return toString(val) === '[object Promise]';
}

/**
 * Check if a value is a Promise with async keyword
 */
export function isAsyncFunction<T = any>(val: any): val is Promise<T> {
	return toString(val) === '[object AsyncFunction]';
}

/**
 * Check the native Promise and thenable object
 */
export function isPromiseLike<T = any>(val: any): val is PromiseLike<T> {
	return (
		isPromise(val) ||
		(!!val && (isObject(val) || isFunction(val)) && isFunction(val.then))
	);
}

export const isInteger = (() => {
	if (isDef(Number.isInteger)) {
		return Number.isInteger;
	}
	if (isDef(Number.isFinite)) {
		return function isInteger<T>(number: T): boolean {
			return (
				Number.isFinite(number) &&
				Math.floor(number as number) === number
			);
		};
	}
	return function isInteger<T>(number: T): boolean {
		return (
			isNumber(number) &&
			isFinite(number) &&
			Math.floor(number) === number
		);
	};
})();

export function isOdd(num: number) {
	if (!isNumber(num)) {
		throw new TypeError('Expected a number');
	}
	if (!isInteger(num)) {
		throw new TypeError('Expected an integer');
	}
	return Math.abs(num & 1) === 1;
}

export function isEven(num: number) {
	if (!isNumber(num)) {
		throw new TypeError('Expected a number');
	}
	if (!isInteger(num)) {
		throw new TypeError('Expected an integer');
	}
	return (num & 1) === 0;
}
