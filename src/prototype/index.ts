/**
 * The `toString` function in object prototype,
 * to get the primitive type of the value
 */
export function toPrimitiveString(val: any) {
	return Object.prototype.toString.call(val);
}
