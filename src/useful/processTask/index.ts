import type { Fn } from '@/types';

export class ProcessTask<T extends Fn<[], any>> {
	#tasks: T[] = [];
	#result: any[] = [];
	#promises: Promise<any[]> | null = null;
	#startProm: Promise<any> | null = null;
	#isRunning: boolean = false;
	#index: number = 0;

	constructor(...tasks: T[]) {
		this.#tasks.push(...tasks);
	}

	get length() {
		return this.#tasks.length;
	}

	start() {
		const promise = new Promise<ReturnType<T>[]>(
			async (resolve, reject) => {
				if (this.#promises) {
					// tasks are over or thrown error.
					if (this.#startProm) {
						this.#startProm = null;
					}
					return this.#promises.then(resolve, reject);
				}
				if (this.#isRunning && this.#startProm) {
					// use when the task is still running.
					return this.#startProm.then(resolve, reject);
				}
				this.#isRunning = true;
				while (this.#index < this.length) {
					const index = this.#index++;
					try {
						const current = this.#tasks[index];
						const result = await current();
						this.#result.push(result);
					} catch (error) {
						this.#isRunning = false;
						reject(error);
						this.#promises = Promise.reject(error);
						return;
					}
					if (!this.#isRunning && index < this.length - 1) {
						return;
					}
				}
				this.#isRunning = false;
				resolve(this.#result);
				this.#promises = Promise.resolve(this.#result);
			},
		);
		if (!this.#startProm && !this.#promises) {
			this.#startProm = promise;
		}
		return promise;
	}

	pause() {
		this.#isRunning = false;
	}
}
