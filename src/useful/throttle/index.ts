import type { ExcludeElements, Fn, ParamatersOptional } from '@/types';
import { isNumber } from '@/is';
import { precisionMillisecond } from '@/time';
import { type Debounce, debounce } from '@/useful/debounce';

type ThrottleOptions<Args extends any[]> = {
	/**
	 * The duration time in milliseconds.
	 * - Default is 300ms.
	 */
	duration?: number;
	/**
	 * To fixed the arguments of the function.
	 */
	fixedArgs?: Args;
	/**
	 * If the latest function is used in duration, whether call it after throttle.
	 * - Default is `false`.
	 */
	alwaysCallLatest?: boolean;
};

type ThrottleConfig<Args extends any[]> = number | ThrottleOptions<Args>;

export type Throttle<P extends any[]> = {
	(...args: P): void;
	/**
	 * Immediatate invoke the function, even if the throttle duration is not over.
	 */
	immediate: (...args: P) => void;
};

type ThrottleResult<
	P extends any[],
	Config extends ThrottleConfig<ParamatersOptional<P>>,
> = Config extends number
	? Throttle<P>
	: Config extends ThrottleOptions<ParamatersOptional<P>>
		? Throttle<ExcludeElements<P, Config['fixedArgs'] & {}>>
		: never;

/**
 * To make a function execute at most once in a given time period.
 * @param options When number, it is the throttle duration in milliseconds, default is 300ms.
 */
export function throttle<P extends any[], Args extends ParamatersOptional<P>>(
	func: Fn<P>,
	options?: ThrottleOptions<Args>,
): ThrottleResult<P, ThrottleOptions<Args>>;
export function throttle<P extends any[]>(
	func: Fn<P>,
	duration?: number,
): ThrottleResult<P, number>;
export function throttle<P extends any[], Args extends ParamatersOptional<P>>(
	func: Fn<P>,
	options?: ThrottleConfig<Args>,
): ThrottleResult<P, ThrottleConfig<Args>> {
	if (isNumber(options)) {
		options = { duration: options } as ThrottleOptions<Args>;
	}
	const {
		duration = 300,
		fixedArgs = [],
		alwaysCallLatest = false,
	} = (options as ThrottleOptions<Args>) || {};
	let useFunc = func;
	if (fixedArgs.length) {
		useFunc = func.bind(null, ...(fixedArgs as any[]));
	}
	let latestTime: number | null = null;
	let current = precisionMillisecond();
	let i = 0;
	let _useLatest: Debounce<any[], void>;
	if (alwaysCallLatest) {
		_useLatest = debounce((...params: any[]) => {
			if (latestTime && precisionMillisecond() - latestTime >= duration) {
				useFunc(...(params as P));
			}
		}, duration + 17);
	}
	const _call = (time: number, ...p: any[]) => {
		latestTime = null;
		i++;
		current = time;
		useFunc(...(p as P));
	};
	const useThrottle = (...params: any[]) => {
		const _current = precisionMillisecond();
		if (alwaysCallLatest) {
			latestTime = _current;
			_useLatest && _useLatest(...params);
		}
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
	return useThrottle as ThrottleResult<P, ThrottleConfig<Args>>;
}
