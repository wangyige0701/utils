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

export function splitByUpper(str: string) {
	return str
		.trim()
		.split(/([A-Z][^A-Z]*)/g)
		.filter(Boolean);
}

export function splitBySpace(str: string) {
	return str.trim().split(/\s+/g).filter(Boolean);
}

export function splitByUnderscore(str: string) {
	return str.trim().split(/_/g).filter(Boolean);
}
