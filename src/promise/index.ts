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

/**
 * Extends the promise result or origin value with the given params.
 * @param value A promiseLike object or other value.
 * @param params The params which push to the result array.
 */
export function extendPromise<P extends any, T extends any[]>(
	value: P,
	...params: T
): Promise<[Awaited<P>, ...T]> {
	const { promise, resolve, reject } = createPromise<[Awaited<P>, ...T]>();
	Promise.resolve(value)
		.then(data => {
			resolve([data, ...params]);
		})
		.catch(err => {
			reject(err);
		});
	return promise;
}
