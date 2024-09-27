import type {
	ParamatersOptional,
	ExcludeElements,
	Fn,
	Awaitable,
} from '@/types';
import { isFunction, isNumber } from '@/is';
import { createPromise } from '@/promise';

type DebounceOptions<Args extends any[]> = {
	/**
	 * The delay in milliseconds.
	 * - Default is 300ms.
	 */
	delay?: number;
	/**
	 * To fixed the arguments of the function.
	 */
	fixedArgs?: Args;
};

type DebounceConfig<Args extends any[]> = number | DebounceOptions<Args>;

type DebounceCallback<R> = Fn<[Awaited<R>], Awaitable<void>>;

type DebounceReturn<R> = Promise<Awaited<R>> & {
	/**
	 * If the function is called before the delay, this call will be canceled.
	 */
	cancel: Fn;
	callback: Fn<[DebounceCallback<R>], DebounceReturn<R>>;
};

export type Debounce<P extends any[], R> = {
	(...args: P): DebounceReturn<R>;
	/**
	 * Without delay, the function will be called immediately.
	 */
	immediate: (...args: P) => R;
};

type DebounceResult<
	P extends any[],
	R extends any,
	Config extends DebounceConfig<ParamatersOptional<P>>,
> = Config extends number
	? Debounce<P, R>
	: Config extends DebounceOptions<ParamatersOptional<P>>
		? Debounce<ExcludeElements<P, Config['fixedArgs'] & {}>, R>
		: never;

/**
 * A debounce function that can be used to limit the rate at which a function is executed.
 * @param func Function to be debounced, can be async.
 * @param options When number, it is the delay, and default is 300ms.
 */
export function debounce<
	P extends any[],
	R extends any,
	Args extends ParamatersOptional<P>,
>(
	func: Fn<P, R>,
	options?: DebounceOptions<Args>,
): DebounceResult<P, R, DebounceOptions<Args>>;
export function debounce<P extends any[], R extends any>(
	func: Fn<P, R>,
	delay?: number,
): DebounceResult<P, R, number>;
export function debounce<
	P extends any[],
	R extends any,
	Args extends ParamatersOptional<P>,
>(
	func: Fn<P, R>,
	options?: DebounceConfig<Args>,
): DebounceResult<P, R, DebounceConfig<Args>> {
	if (isNumber(options)) {
		options = { delay: options } as DebounceConfig<Args>;
	}
	const { delay = 300, fixedArgs = [] } =
		(options as DebounceOptions<Args>) || {};
	let useFunc = func;
	if (fixedArgs.length) {
		useFunc = func.bind(null, ...(fixedArgs as any[]));
	}
	let timer: NodeJS.Timeout | number | null = null;
	let i = 0;
	const _cancel = () => {
		if (timer) {
			clearTimeout(timer);
		}
		callbacks.length = 0;
	};
	const callbacks = [] as DebounceCallback<R>[];
	const useDebounce = (...params: any[]) => {
		let lock = false;
		// will be compared in cancel function, so use ++i.
		const index = ++i;
		_cancel();

		// promise
		const { promise, resolve } = createPromise<
			Awaited<R>,
			DebounceReturn<R>
		>();

		// logic
		timer = globalThis.setTimeout(async () => {
			const result = await useFunc(...(params as P));
			const funs = callbacks.splice(0);
			for (let i = 0; i < funs.length; i++) {
				const fn = funs[i];
				await fn?.(result);
			}
			resolve(result);
		}, delay);

		// cancel function
		const cancel = () => {
			if (lock) {
				throw new Error(
					'This debounce target has already been canceled',
				);
			}
			if (index === i) {
				_cancel();
				lock = true;
			}
		};

		// callback queue
		const callback = (fn: DebounceCallback<R>) => {
			if (lock) {
				throw new Error('This debounce target has been canceled');
			}
			if (!isFunction(fn)) {
				throw new TypeError('The callback must be a function');
			}
			callbacks.push(fn);
			return promise;
		};

		// result
		promise.cancel = cancel;
		promise.callback = callback;
		return promise;
	};

	// use for immediate call.
	useDebounce.immediate = (...params: any[]) => {
		_cancel();
		return useFunc(...(params as P));
	};
	return useDebounce as DebounceResult<P, R, DebounceConfig<Args>>;
}
