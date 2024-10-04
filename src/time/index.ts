import type { Fn } from '@/types';
import { isDef, isNumber } from '@/is';
import { globals } from '@/env';

export function delay(time: number, cb?: Fn<[], any>) {
	if (!isNumber(time)) {
		throw new Error('The delay time must be a number');
	}
	if (time < 0) {
		throw new Error('The delay time must be a positive number');
	}
	return new Promise<void>(resolve => {
		globals.setTimeout(async () => {
			await cb?.();
			resolve();
		}, time);
	});
}

/**
 * Use `performance.now` or `Date.now` to get the precision millisecond timestamp,
 * if both are not available, use `new Date().getTime()`
 */
export const precisionMillisecond = (() => {
	if (isDef(globals.performance)) {
		return () => globals.performance.now();
	} else if (isDef(Date.now)) {
		return () => Date.now();
	} else {
		return () => new Date().getTime();
	}
})();
