import type { PromiseReject, PromiseResolve } from '@/types';

/**
 * Get an object with a promise and it resolve, reject methods.
 */
export function createPromise<T>() {
	let resolve: PromiseResolve<T>;
	let reject: PromiseReject;
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return {
		promise,
		resolve: resolve!,
		reject: reject!,
	};
}
