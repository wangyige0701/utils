import type { Constructor } from '@/types';
import { singleton } from '@/clazz';

export function Singleton() {
	return function <T>(target: Constructor<T, any[]>) {
		return singleton(target);
	};
}
