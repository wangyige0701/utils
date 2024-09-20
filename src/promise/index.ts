import type { PromiseReject, PromiseResolve } from '@/types';

/**
 * Get an object with a promise and it resolve, reject methods.
 */
export function createPromise<T, R = Promise<T>>() {
	let resolve: PromiseResolve<T>;
	let reject: PromiseReject;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	}) as R;
	return {
		promise,
		resolve: resolve!,
		reject: reject!,
	};
}
