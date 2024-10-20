import { splitString } from '@/iterator';

export function firstUpperCase<T extends string>(str: T): Capitalize<T> {
	return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

export function firstLowerCase<T extends string>(str: T): Uncapitalize<T> {
	return (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<T>;
}

export function upperCase<T extends string>(str: T): Uppercase<T> {
	return str.toUpperCase() as Uppercase<T>;
}

export function lowerCase<T extends string>(str: T): Lowercase<T> {
	return str.toLowerCase() as Lowercase<T>;
}

export const splitByUpper = (() => {
	const match = /([A-Z][^A-Z]*)/g;
	const splitByUpper = (str: string) => {
		return str.trim().split(match).filter(Boolean);
	};
	const splitMatch = /[A-Z]/;
	splitByUpper.iterator = (str: string) => {
		return splitString(str, splitMatch, false);
	};
	return splitByUpper;
})();

export const splitBySpace = (() => {
	const match = /\s+/g;
	const splitBySpace = (str: string) => {
		return str.trim().split(match).filter(Boolean);
	};
	const splitMatch = /\s+/;
	splitBySpace.iterator = (str: string) => {
		return splitString(str, splitMatch);
	};
	return splitBySpace;
})();

export const splitByUnderscore = (() => {
	const match = /\_/g;
	const splitByUnderscore = (str: string) => {
		return str.trim().split(match).filter(Boolean);
	};
	const splitMatch = /\_+/;
	splitByUnderscore.iterator = (str: string) => {
		return splitString(str, splitMatch);
	};
	return splitByUnderscore;
})();

export const splitByPoint = (() => {
	const match = /\./g;
	const splitByPoint = (str: string) => {
		return str.trim().split(match).filter(Boolean);
	};
	const splitMatch = /\.+/;
	splitByPoint.iterator = (str: string) => {
		return splitString(str, splitMatch);
	};
	return splitByPoint;
})();

/**
 * Create a random string of the specified length.
 */
export const randomString = (() => {
	const range = [
		{ start: 97, end: 122, len: 122 - 97 + 1 },
		{ start: 65, end: 90, len: 90 - 65 + 1 },
		{ start: 48, end: 57, len: 57 - 48 + 1 },
	] as const;
	const cache: string[] = [];
	const _i = (length: number) => {
		return (Math.random() * length) | 0;
	};
	const create = (length: number) => {
		let str = '';
		while (length-- > 0) {
			const _v = range[_i(range.length)];
			str += String.fromCharCode(_v.start + _i(_v.len));
		}
		if (cache.includes(str)) {
			return create(length);
		}
		cache.push(str);
		return str;
	};
	return create;
})();
