import type { Constructor } from '@/types';
import { singleton } from '@/clazz';

/**
 * A decorator for singleton class
 */
export function Singleton() {
	return function <T>(target: Constructor<T, any[]>) {
		return singleton(target);
	};
}
