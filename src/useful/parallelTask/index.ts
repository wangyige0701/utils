import { isFunction, isNumber } from '@/is';
import { Awaitable, Fn, PromiseReject, PromiseResolve } from '@/types';

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

	#triggerOnEmpty() {
		const fns = this.#onEmptyList.splice(0);
		for (const fn of fns) {
			fn?.();
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
		const promise = new Promise<R>((resolve, reject) => {
			this.#queue.push({ task, paramaters, resolve, reject });
			this.#execute();
		});
		(promise as Task<R>).cancel = () => {
			this.cancel(task);
		};
		return promise as Task<R>;
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
