/**
 * Use `Object.keys` to get the keys of the object.
 */
export function objectKeys<T extends object>(o: T) {
	return Object.keys(
		o,
	) as Array<`${keyof T & (string | number | boolean | null | undefined)}`>;
}
