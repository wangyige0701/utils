import type { Fn } from '@/types';
import { isFunction } from '@/is';

type UseResult<T extends boolean, R extends any> = T extends true
	? Promise<R>
	: R;

type Options<A extends boolean = false> = {
	/**
	 * Whether the function which has been added in list can still be added.
	 * - default is `false`
	 */
	only?: boolean;
	/**
	 * Whether the function called once then removed.
	 * - default is `false`
	 */
	once?: boolean;
	/**
	 * Whether the function is used async.
	 * - default is `false`
	 */
	async?: A;
};

/**
 * Collect functions and circulate called them by insert order.
 */
export class UseFunction<
	T extends Fn<any[], any>,
	A extends boolean = false,
	P = Parameters<T>,
	R = ReturnType<T>,
> {
	#only: boolean;
	#once: boolean;
	#async: boolean;
	#list: T[] = [];
	#index: number = 0;
	#current: T | null = null;

	constructor(options?: Options<A>) {
		const { only = false, once = false, async = false } = options || {};
		this.#only = only;
		this.#once = once;
		this.#async = async;
	}

	public get length() {
		return this.#list.length;
	}

	public add(func: T) {
		if (isFunction(func)) {
			if (this.#only && this.#list.includes(func)) {
				throw new Error('This function is already be added');
			}
			this.#list.push(func);
			this.#directTo();
			return this.length;
		}
		throw new TypeError('The `func` param must be a function');
	}

	public remove(func: T) {
		if (isFunction(func) && this.#list.includes(func)) {
			const index = this.#list.findIndex(i => i === func);
			this.#list.splice(index, 1);
			if (func === this.#current) {
				this.#directTo();
			} else {
				if (index <= this.#index) {
					this.#index--;
				}
			}
		}
		return this.length;
	}

	public use(...args: P & any[]): UseResult<A, R> {
		if (!this.#current) {
			throw new Error('Be used function is undefined');
		}
		return this.#called(this.#current!, ...args) as UseResult<A, R>;
	}

	public all(...args: P & any[]): UseResult<A, undefined> {
		this.reset();
		let i = 0;
		const length = this.length;
		if (this.#async) {
			return (async () => {
				while (i < length) {
					i++;
					await (this.use as Fn<any[], Promise<R>>)(...args);
				}
			})() as UseResult<A, undefined>;
		}
		while (i < length) {
			i++;
			this.use(...args);
		}
		return void 0 as UseResult<A, undefined>;
	}

	public reset() {
		this.#index = 0;
		this.#directTo();
	}

	#called(fn: T, ...args: P & any[]) {
		this.#next();
		this.#directTo();
		if (this.#once) {
			this.remove(fn);
		}
		if (this.#async) {
			return (async () => {
				if (!fn) {
					return;
				}
				const target = await Promise.resolve(fn(...args));
				return target;
			})() as Promise<R>;
		}
		if (!fn) {
			return;
		}
		return fn(...args) as R;
	}

	#next() {
		if (this.#index >= this.length - 1) {
			this.#index = 0;
		} else {
			this.#index++;
		}
		return this.#index;
	}

	#directTo(): T | null {
		const now = this.#list[this.#index];
		if (!now) {
			if (this.length) {
				this.#next();
				return this.#directTo();
			}
			this.#current = null;
		} else {
			if (now === this.#current) {
				return this.#current;
			}
			this.#current = now;
		}
		return this.#current;
	}
}
