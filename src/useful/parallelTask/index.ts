import type { Awaitable, Fn, PromiseReject, PromiseResolve } from '@/types';
import { isFunction, isNumber } from '@/is';
import { createPromise } from '@/promise';
import { nextTick } from '@/useful/nextTick';

type Task<T> = Promise<T> & {
	cancel: Fn;
	index: number;
};

export type ParallelTaskResult<T> = Task<T>;

/**
 * Control multiple tasks execute a given quantity at the same time.
 * @param count The maximum number of tasks that can be executed at the same time.
 * - Must be greater than 0.
 */
export class ParallelTask {
	#index = 0;
	#maxCount: number;
	#running: number = 0;
	#emptyExecuteQueue: Array<{ fn: Fn<[], any>; once: boolean }> = [];
	#queue: Array<{
		task: Fn<any[], Awaitable<any>>;
		paramaters: any[];
		resolve: PromiseResolve;
		reject: PromiseReject;
		index: number;
	}> = [];

	constructor(count: number = 3) {
		if (!isNumber(count)) {
			throw new Error('`total` must be a number');
		}
		if (count <= 0) {
			throw new Error('`total` must be greater than 0');
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

	#triggerOnEmpty() {
		const funs = this.#emptyExecuteQueue.slice(0);
		for (let i = 0; i < funs.length; i++) {
			const func = funs[i];
			const { fn, once = true } = func;
			if (once) {
				this.#emptyExecuteQueue.splice(
					this.#emptyExecuteQueue.indexOf(func),
					1,
				);
			}
			fn?.();
		}
	}

	/**
	 * Change the maximum number of parallel tasks.
	 */
	changeMaxParallelCount(count: number) {
		this.#maxCount = count;
	}

	/**
	 * Add a task to the queue, and the rest params will be passed in the task.
	 * @returns A promise with a cancel method and the index of the task.
	 */
	add<P extends any[], R>(task: Fn<P, Awaitable<R>>, ...args: P): Task<R> {
		if (!isFunction(task)) {
			throw new Error('`task` must be a function');
		}
		const index = this.#index++;
		const paramaters = [...args];
		const { promise, resolve, reject } = createPromise<R, Task<R>>();
		this.#queue.push({
			task,
			paramaters,
			resolve,
			reject,
			index,
		});
		promise.index = index;
		promise.cancel = () => {
			this.cancel(index);
		};
		nextTick(() => {
			this.#execute();
		});
		return promise;
	}

	/**
	 * Cancel the task.
	 * @param task The task to cancel, can be a function or an index.
	 * If it's a function, it will cancel the first task that matches the function.
	 */
	cancel(task: Fn<any[], Awaitable<any>> | number) {
		let index = -1;
		if (isNumber(task)) {
			index = this.#queue.findIndex(i => i.index === task);
		} else if (isFunction(task)) {
			index = this.#queue.findIndex(i => i.task === task);
		}
		if (index > -1) {
			this.#queue.splice(index, 1);
			this.#execute();
		}
	}

	/**
	 * Whether the give task is pending. If the result is false, it may be canceled or executed.
	 * @param task The task to check, can be a function or an index.
	 */
	isPending(task: Fn<any[], Awaitable<any>> | number) {
		if (isNumber(task)) {
			return this.#queue.some(i => i.index === task);
		}
		return this.#queue.some(i => i.task === task);
	}

	/**
	 * Execute when the queue is empty.
	 * @param {boolean} once Whether execute once when task empty.
	 * - Default is true.
	 */
	onEmpty(fn: Fn<[], any>, once: boolean = true) {
		if (!isFunction(fn)) {
			throw new TypeError('The param pass in must be a function');
		}
		this.#emptyExecuteQueue.push({ fn, once });
	}
}
