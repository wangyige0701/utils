import type { Fn } from '@/types';
import { isFunction, isNumber, isRegExp, isString, isUndefined } from '@/is';
import { settingFlags, toRegExp } from '@/regexp';

/**
 * Create a range iterator
 * @param start
 * @param end
 * @param step must be positive
 */
export function range(
	start: number,
	end: number,
	step?: number,
): IterableIterator<number>;
export function range(end: number): IterableIterator<number>;
export function* range(start: number, end?: number, step: number = 1) {
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

/**
 * Split string by give rule, and return an iterator
 * @param use A string, regexp or a function.
 * - String, fully match the string.
 * - RegExp, will ignore the flags.
 * - When a function is given, the first param is the string in current index,
 *  the second param is the currently index, the third param is the origin string,
 *  the fourth param is a function to collect matched number and whether the matched string will be collected.
 * @param jump Whether the matched string will be collected, used when use is not a function.
 */
export function* splitString(
	str: string,
	use:
		| string
		| RegExp
		| Fn<
				[
					str: string,
					index: number,
					origin: string,
					collect: Fn<[num?: number, jump?: boolean]>,
				]
		  >,
	jump: boolean = true,
) {
	if (!isString(str)) {
		throw new TypeError('First param must be a string');
	}
	const origin = str;
	const needJump = jump;
	let index = 0;
	let beCollected = false;
	let colleceted: string = '';
	const forward = (num?: number, jump: boolean = true) => {
		if (isUndefined(num)) {
			num = 1;
		}
		if (!isNumber(num)) {
			throw new TypeError('num must be a number');
		}
		beCollected = true;
		const next = Math.max(1, num);
		const cut = origin.substring(index, index + num);
		index += next;
		if (!jump && cut.length) {
			colleceted = cut;
		}
	};
	if (!isFunction(use)) {
		if (!isString(use) && !isRegExp(use)) {
			throw new TypeError(
				'Second param must be a string or a RegExp or a function which return value is boolean',
			);
		}
		if (isString(use)) {
			const matchLength = use.length;
			const matchStr = use;
			use = (str, index, origin, collect) => {
				if (!matchStr.startsWith(str)) {
					return;
				}
				if (origin.substring(index, index + matchLength) !== matchStr) {
					return;
				}
				return collect(matchLength, needJump);
			};
		} else {
			// remove regexp flags
			const _removeFlag = settingFlags(use, false);
			const matchRegexp = toRegExp('^(?=(', _removeFlag, '))', '.*');
			use = (_str, index, origin, collect) => {
				const result = matchRegexp.exec(origin.substring(index));
				if (!result) {
					return;
				}
				if (!result[1]?.length) {
					return;
				}
				return collect(result[1].length, needJump);
			};
		}
	}
	const length = origin.length;
	let val = '';
	while (index < length) {
		const str = origin[index];
		use(str, index, origin, forward);
		if (beCollected) {
			const result = val;
			val = '' + colleceted;
			beCollected = false;
			colleceted = '';
			if (result) {
				yield result;
			}
		} else {
			val += str;
			index++;
		}
	}
	if (val) {
		yield val;
	}
}
