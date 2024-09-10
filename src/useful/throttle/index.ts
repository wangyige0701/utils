import type { ExcludeElements, Fn, ParamatersOptional } from '@/types';
import { isNumber } from '@/is';
import { precisionMillisecond } from '@/time';

type ThrottleOptions<P extends any[]> = {
	/**
	 * The duration time in milliseconds.
	 * - Default is 300ms.
	 */
	duration?: number;
	/**
	 * To fixed the arguments of the function.
	 */
	fixedArgs?: ParamatersOptional<P>;
};

type ThrottleConfig<P extends any[]> = number | ThrottleOptions<P>;

type ThrottleResultReturn<P extends any[]> = {
	(...args: P): void;
	/**
	 * Immediatate invoke the function, even if the throttle duration is not over.
	 */
	immediate: (...args: P) => void;
};

type ThrottleResult<
	P extends any[],
	Config extends ThrottleConfig<P>,
> = Config extends number
	? ThrottleResultReturn<P>
	: ThrottleResultReturn<
			ExcludeElements<
				P,
				// @ts-expect-error
				Config['fixedArgs']
			>
		>;

/**
 * To make a function execute at most once in a given time period.
 * @param options When number, it is the throttle duration in milliseconds, default is 300ms.
 */
export function throttle<P extends any[], Config extends ThrottleConfig<P>>(
	func: Fn<P>,
	options?: Config,
): ThrottleResult<P, Config>;
export function throttle<P extends any[]>(
	func: Fn<P>,
	duration?: number,
): ThrottleResult<P, number>;
export function throttle<P extends any[], Config extends ThrottleConfig<P>>(
	func: Fn<P>,
	options?: Config,
): ThrottleResult<P, Config> {
	if (isNumber(options)) {
		options = { duration: options } as Config;
	}
	const { duration = 300, fixedArgs = [] } =
		(options as ThrottleOptions<P>) || {};
	let useFunc = func;
	if (fixedArgs.length) {
		useFunc = func.bind(null, ...(fixedArgs as any[]));
	}
	let current = precisionMillisecond();
	let i = 0;
	const _call = (time: number, ...p: any[]) => {
		i++;
		current = time;
		useFunc(...(p as P));
	};
	const useThrottle = (...params: any[]) => {
		const _current = precisionMillisecond();
		if (i === 0) {
			_call(_current, ...params);
		}
		if (_current - current >= duration) {
			_call(_current, ...params);
		}
		return;
	};
	useThrottle.immediate = (...params: any) => {
		_call(precisionMillisecond(), ...params);
	};
	return useThrottle as ThrottleResult<P, Config>;
}
