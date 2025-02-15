import { isNumber } from '@/is';
import { toString } from '@/to';

/**
 * Add zero to the left of the number, containing the digits string
 * @param length The length of the final string, default is 2
 */
export function addZero(num: number | string, length: number = 2): string {
	num = toString(num);
	if (!matchNumber(num)) {
		return num;
	}
	return num.padStart(length, '0');
}

type InRangeOption = {
	/** 上界闭区间 */
	includeMin?: boolean;
	/** 下界闭区间 */
	includeMax?: boolean;
};

/**
 * The default is contain the max and min
 */
export function inRange(
	num: number,
	min: number,
	max: number,
	options?: InRangeOption,
): boolean {
	if (min > max) {
		throw new Error('min should be less than max');
	}
	const { includeMin = true, includeMax = true } = options || {};
	return (
		(num > min || (includeMin && num === min)) &&
		(num < max || (includeMax && num === max))
	);
}

export function clamp(num: number, min: number, max: number): number {
	if (min > max) {
		throw new Error('min should be less than max');
	}
	return Math.min(Math.max(num, min), max);
}

type RangeOption = InRangeOption;

/**
 * Get a random integer number between min and max
 */
export function randomInteger(min: number, max: number, options?: RangeOption) {
	if (min > max) {
		throw new Error('min should be less than max');
	}
	const { includeMin = true, includeMax = true } = options || {};
	const value = Math.floor(Math.random() * (max - min + 1)) + min;
	if (!includeMin && value === min) {
		return randomInteger(min, max, options);
	}
	if (!includeMax && value === max) {
		return randomInteger(min, max, options);
	}
	return value;
}

/**
 * Use regexp to get if all characters are digits
 */
export const matchNumber = (() => {
	const reg = /^\d+(\.\d+)?$/;
	return function matchNumber(val: string | number) {
		if (isNumber(val)) {
			return true;
		}
		return reg.test(toString(val));
	};
})();
