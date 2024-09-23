import type { Awaitable, Fn, PromiseReject, PromiseResolve } from '@/types';
import { isFunction, isNumber } from '@/is';
import { createPromise } from '@/promise';
import { nextTick } from '@/useful/nextTick';

type Task<T> = Promise<T> & {
	cancel: Fn;
};

export class ParallelTask {
	#maxCount: number;
	#running: number = 0;
	#onEmptyList: Array<Fn<[], any>> = [];
	#queue: Array<{
		task: Fn<any[], Awaitable<any>>;
		paramaters: any[];
		resolve: PromiseResolve;
		reject: PromiseReject;
	}> = [];

	constructor(count: number = 3) {
		if (!isNumber(count)) {
			throw new Error("'total' must be a number");
		}
		if (count <= 0) {
			throw new Error("'total' must be greater than 0");
		}
		this.#maxCount = count;
	}

	#execute() {
		if (this.#running >= this.#maxCount) {
			return;
		}
		if (!this.#queue.length) {
			if (!this.#running) {
				this.#triggerOnEmpty();
			}
			return;
		}
		this.#running++;
		const { task, paramaters, resolve, reject } = this.#queue.shift()!;
		Promise.resolve(task(...paramaters))
			.then(resolve)
			.catch(reject)
			.finally(() => {
				this.#running--;
				this.#execute();
			});
		this.#execute();
	}

	async #triggerOnEmpty() {
		const funs = this.#onEmptyList.splice(0);
		for (let i = funs.length - 1; i >= 0; i--) {
			const fn = funs[i];
			await fn?.();
		}
	}

	changeMaxParallelCount(count: number) {
		this.#maxCount = count;
	}

	add<P extends any[], R>(task: Fn<P, Awaitable<R>>, ...args: P): Task<R> {
		if (!isFunction(task)) {
			throw new Error("'task' must be a function");
		}
		const paramaters = [...args];
		const { promise, resolve, reject } = createPromise<R, Task<R>>();
		this.#queue.push({ task, paramaters, resolve, reject });
		promise.cancel = () => {
			this.cancel(task);
		};
		nextTick(() => {
			this.#execute();
		});
		return promise;
	}

	cancel(task: Fn<any[], Awaitable<any>>) {
		const index = this.#queue.findIndex(i => i.task === task);
		if (index > -1) {
			this.#queue.splice(index, 1);
			this.#execute();
		}
	}

	onEmpty(fn: Fn<[], any>) {
		if (!isFunction(fn)) {
			throw new Error("'fn' must be a function");
		}
		this.#onEmptyList.push(fn);
	}
}
