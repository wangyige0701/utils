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
