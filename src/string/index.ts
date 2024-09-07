import { splitStringIterator } from '@/iterator';

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
	const a = /([A-Z][^A-Z]*)/g;
	const func = (str: string) => {
		return str.trim().split(a).filter(Boolean);
	};
	const b = /^([A-Z])$/;
	func.iterator = (str: string) => {
		return splitStringIterator(str, b);
	};
	return func;
})();

export const splitBySpace = (() => {
	const a = /\s+/g;
	const func = (str: string) => {
		return str.trim().split(a).filter(Boolean);
	};
	const b = /^\s+$/;
	func.iterator = (str: string) => {
		return splitStringIterator(str, b);
	};
	return func;
})();

export const splitByUnderscore = (() => {
	const a = /_/g;
	const func = (str: string) => {
		return str.trim().split(a).filter(Boolean);
	};
	const b = /^\_+$/;
	func.iterator = (str: string) => {
		return splitStringIterator(str, b);
	};
	return func;
})();
