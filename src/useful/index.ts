import { isNumber } from '@/is';
import type { Fn } from '@/types';

export * from './debounce';

export function delay(time: number, cb?: Fn<[], any>) {
	if (!isNumber(time)) {
		throw new Error('The delay time must be a number');
	}
	if (time < 0) {
		throw new Error('The delay time must be a positive number');
	}
	return new Promise<void>(resolve => {
		globalThis.setTimeout(() => {
			cb?.();
			resolve();
		}, time);
	});
}
