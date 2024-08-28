import { isNumber, isUndefined } from '@/is';

/**
 * Create a range iterator
 * @param start
 * @param end
 * @param step must be positive
 */
export function rangeIterator(
	start: number,
	end: number,
	step?: number,
): IterableIterator<number>;
export function rangeIterator(end: number): IterableIterator<number>;
export function* rangeIterator(start: number, end?: number, step: number = 1) {
	if (isUndefined(end)) {
		end = start;
		start = 0;
	}
	if (!isNumber(step)) {
		throw new TypeError('step must be a number');
	}
	if (step <= 0) {
		throw new RangeError('step must be a positive number');
	}
	const direction = end - start > 0 ? 1 : -1;
	step = Math.max(Math.abs(step), 1) * direction;
	for (let i = start; i * direction < end * direction; i += step) {
		yield i;
	}
}
