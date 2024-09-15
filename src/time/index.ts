import type { Fn } from '@/types';
import { isDef, isNumber } from '@/is';

export function delay(time: number, cb?: Fn<[], any>) {
	if (!isNumber(time)) {
		throw new Error('The delay time must be a number');
	}
	if (time < 0) {
		throw new Error('The delay time must be a positive number');
	}
	return new Promise<void>(resolve => {
		globalThis.setTimeout(async () => {
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
	if (isDef(globalThis.performance)) {
		return () => globalThis.performance.now();
	} else if (isDef(Date.now)) {
		return () => Date.now();
	} else {
		return () => new Date().getTime();
	}
})();
