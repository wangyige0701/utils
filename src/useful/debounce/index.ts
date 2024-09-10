import { isNumber } from '@/is';
import type { ParamatersOptional, ExcludeElements, Fn } from '@/types';

type DebounceOptions<P extends any[]> = {
	/**
	 * The delay in milliseconds.
	 */
	delay?: number;
	/**
	 * To fixed the arguments of the function.
	 */
	fixedArgs?: ParamatersOptional<P>;
};

type DebounceConfig<P extends any[]> = number | DebounceOptions<P>;

type DebounceResultReturn<R> = {
	/**
	 * If the function is called before the delay, this call will be canceled.
	 */
	cancel: Fn;
	callback: Fn<[Fn<[R]>], DebounceResultReturn<R>>;
};

type DebounceResultReturnFn<P extends any[], R> = {
	(...args: P): DebounceResultReturn<R>;
	/**
	 * Without delay, the function will be called immediately.
	 */
	immediate: (...args: P) => R;
};

type DebounceResult<
	P extends any[],
	R extends any,
	Config extends DebounceConfig<P>,
> = Config extends number
	? DebounceResultReturnFn<P, R>
	: DebounceResultReturnFn<
			ExcludeElements<
				P,
				// @ts-expect-error
				Config['fixedArgs']
			>,
			R
		>;

/**
 * A debounce function that can be used to limit the rate at which a function is executed.
 * @param func Function to be debounced
 * @param options When number, it is the delay.
 */
export function debounce<
	P extends any[],
	R extends any,
	Config extends DebounceOptions<P>,
>(func: Fn<P, R>, options?: Config): DebounceResult<P, R, Config>;
export function debounce<P extends any[], R extends any>(
	func: Fn<P, R>,
	delay?: number,
): DebounceResult<P, R, number>;
export function debounce<
	P extends any[],
	R extends any,
	Config extends DebounceConfig<P>,
>(func: Fn<P, R>, options?: Config): DebounceResult<P, R, Config> {
	if (isNumber(options)) {
		options = { delay: options } as Config;
	}
	const { delay = 300, fixedArgs = [] } =
		(options as DebounceOptions<P>) || {};
	let useFunc = func;
	if (fixedArgs.length) {
		useFunc = func.bind(null, ...(fixedArgs as any[]));
	}
	let timer: number | null = null;
	let i = 0;
	const cancel = () => {
		if (timer) {
			clearTimeout(timer);
		}
		callbacks.splice(0);
	};
	const callbacks = [] as Fn<[R], void>[];
	const useDebounce = (...params: any[]) => {
		let lock = false;
		const index = ++i;
		cancel();
		timer = window.setTimeout(() => {
			const result = useFunc(...(params as P));
			callbacks.splice(0).forEach(fn => fn(result));
		}, delay);
		const _cancel = () => {
			if (lock) {
				throw new Error('This debounce target has been canceled');
			}
			if (index === i) {
				cancel();
				lock = true;
			}
		};
		const _callback = (fn: Fn<[R], void>) => {
			if (lock) {
				throw new Error('This debounce target has been canceled');
			}
			callbacks.push(fn);
			return result;
		};
		let result = {
			cancel: _cancel,
			callback: _callback,
		};
		return result;
	};
	useDebounce.immediate = (...params: any[]) => {
		cancel();
		return useFunc(...(params as P));
	};
	return useDebounce as DebounceResult<P, R, Config>;
}

function test(a: number, b: number, c: boolean) {}
const a = debounce(test);
const b = a(1, 2, true).callback(v => {});
b.cancel();
