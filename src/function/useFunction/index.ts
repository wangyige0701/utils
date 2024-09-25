import { isFunction, isString } from '@/is';
import { inEnum } from '@/object';
import type { Fn } from '@/types';

export enum UseFunctionType {
	STACK = 'stack',
	QUEUE = 'queue',
}

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
	 * The function use type
	 */
	type?: UseFunctionType;
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

export class UseFunction<
	T extends Fn<any[], any>,
	A extends boolean = false,
	P = Parameters<T>,
	R = ReturnType<T>,
> {
	#type: UseFunctionType;
	#only: boolean;
	#once: boolean;
	#async: boolean;
	#list: T[] = [];
	#index: number = 0;
	#now: T | null = null;

	constructor(type: UseFunctionType | Options<A> = UseFunctionType.QUEUE) {
		if (isString(type)) {
			if (inEnum(UseFunctionType, type)) {
				type = { type } as Options<A>;
			} else {
				throw new TypeError(
					`The type ${type} is not in UseFunctionType`,
				);
			}
		}
		this.#type = type.type || UseFunctionType.QUEUE;
		this.#only = type.only ?? false;
		this.#once = type.once ?? false;
		this.#async = type.async ?? false;
	}

	public add(func: T) {
		if (isFunction(func)) {
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
			if (func === this.#now) {
				this.#directTo();
			} else {
				if (
					this.#type === UseFunctionType.QUEUE &&
					index <= this.#index
				) {
					this.#index--;
				} else if (
					this.#type === UseFunctionType.STACK &&
					index >= this.#index
				) {
					this.#index++;
				}
			}
		}
		return this.length;
	}

	public get length() {
		return this.#list.length;
	}

	public next(...args: P & any[]): UseResult<A, R> {
		return this.#whetherAsync(this.#now!, ...args) as UseResult<A, R>;
	}

	public all(...args: P & any[]): UseResult<A, undefined> {
		let i = 0;
		const length = this.length;
		if (this.#async) {
			return (async () => {
				while (i < length) {
					i++;
					await (this.next as Fn<any[], Promise<R>>)(...args);
				}
			})() as UseResult<A, undefined>;
		}
		while (i < length) {
			i++;
			this.next(...args);
		}
		return void 0 as UseResult<A, undefined>;
	}

	public reset() {
		if (this.#type === UseFunctionType.QUEUE) {
			this.#index = 0;
		} else if (this.#type === UseFunctionType.STACK) {
			this.#index = this.length - 1;
		} else {
			throw new Error();
		}
		this.#directTo();
	}

	#whetherAsync(fn: T, ...args: P & any[]) {
		this.#move();
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

	#move() {
		if (this.#type === UseFunctionType.QUEUE) {
			if (this.#index >= this.length - 1) {
				this.#index = 0;
			} else {
				this.#index++;
			}
		} else if (this.#type === UseFunctionType.STACK) {
			if (this.#index <= 0) {
				this.#index = this.length - 1;
			} else {
				this.#index--;
			}
		} else {
			throw new Error();
		}
		return this.#index;
	}

	#directTo(): T | null {
		const now = this.#list[this.#index];
		if (!now) {
			if (this.length) {
				this.#move();
				return this.#directTo();
			}
			this.#now = null;
		} else {
			if (now === this.#now) {
				return this.#now;
			}
			this.#now = now;
		}
		return this.#now;
	}
}
