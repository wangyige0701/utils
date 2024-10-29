import type { Fn } from '@/types';
import { isDef, isNumber } from '@/is';
import { getGlobal } from '@/env';

export function delay(time: number, cb?: Fn<[], any>) {
	if (!isNumber(time)) {
		throw new Error('The delay time must be a number');
	}
	if (time < 0) {
		throw new Error('The delay time must be a positive number');
	}
	return new Promise<void>(resolve => {
		getGlobal().setTimeout(async () => {
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
	if (isDef(getGlobal().performance)) {
		return () => getGlobal().performance.now();
	} else if (isDef(Date.now)) {
		return () => Date.now();
	} else {
		return () => new Date().getTime();
	}
})();

type FrequencyOptions = {
	/**
	 * The range of the frequency check.
	 */
	range: number;
	/**
	 * The maximum number of times the target can be executed.
	 */
	maximum: number;
};

type FrequencyCb = Fn<
	[config: FrequencyOptions, current: number, type?: string],
	any
>;

/**
 * To check the frequency of the target execution.
 * @param cb The callback if the frequency over the limit.
 */
export function checkFrequency(options: FrequencyOptions, cb: FrequencyCb) {
	const { range, maximum } = options;
	if (!isNumber(range) || !isNumber(maximum)) {
		throw new Error('The range and maximum must be a number');
	}
	if (range < 0 || maximum < 0) {
		throw new Error('The range and maximum must be a positive number');
	}
	const queue = [] as Array<{ time: number; count: number; type?: string }>;
	function discard(cb: FrequencyCb, type?: string) {
		const current = precisionMillisecond();
		for (let i = 0; i < queue.length; i++) {
			const { time, type: recordType } = queue[i];
			if (type && type !== recordType) {
				continue;
			}
			if (current - time <= range) {
				if (i >= 1) {
					queue.splice(0, i);
				}
				break;
			}
		}
		const countSum = type
			? queue.reduce((sum, item) => {
					return sum + (type === item.type ? item.count : 0);
				}, 0)
			: queue.reduce((sum, item) => sum + item.count, 0);
		if (countSum > maximum) {
			cb(options, countSum, type);
		}
	}
	let timer: NodeJS.Timeout | null = null;
	/**
	 * Trigger to collect times.
	 * @param count The count to add to the queue.
	 * @param type The type of the trigger.
	 */
	return function trigger(count: number = 1, type?: string) {
		timer && clearTimeout(timer);
		timer = setTimeout(() => {
			queue.length = 0;
		}, range * 2);
		const current = precisionMillisecond();
		queue.push({ time: current, count, type });
		discard(cb, type);
	};
}
