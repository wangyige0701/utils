import type { Constructor, Fn } from '@/types';
import { isUndef } from '@/is';

/**
 * Create a singleton class,
 * the instance of the class which proxy by this function will modify the constructor,
 * so that the instance which create by the constructor is still the same singleton.
 */
export const singleton = (() => {
	let _singleton: <T extends Constructor<any>>(clazz: T) => T;

	function paramsCheck(params: any[], args: any[]) {
		if (
			params.length !== args.length ||
			!params.every((item, index) => item === args[index])
		) {
			throw new Error(
				'Singleton class can not be constructed with different parameters',
			);
		}
	}

	function _createConstructor<T extends Constructor<any>>(
		clazz: T,
		proxy: boolean,
	): Fn<any[], T> {
		let _instance: T;
		const params: any[] = [];
		function _construct(this: any, ...args: any[]) {
			if (new.target === _construct || this instanceof _construct) {
				return _construct(...args);
			}
			if (!_instance) {
				params.push(...args);
				if (!proxy) {
					_instance = new clazz(...args);
					_instance.constructor = _construct;
				} else {
					_instance = new globalThis.Proxy(new clazz(...args), {
						get(target, p) {
							if (p === 'constructor') {
								return _construct;
							}
							return Reflect.get(target, p);
						},
					});
				}
			}
			paramsCheck(params, args);
			return _instance;
		}
		return _construct;
	}

	if (isUndef(globalThis.Proxy)) {
		_singleton = <T extends Constructor<any>>(clazz: T) => {
			const _construct = _createConstructor(clazz, true);
			return new globalThis.Proxy(clazz, {
				construct(_, args) {
					return _construct(...args);
				},
			});
		};
	} else {
		_singleton = <T extends Constructor<any>>(clazz: T) => {
			const _construct = _createConstructor(clazz, false);
			return <T>class {
				constructor(...args: any[]) {
					return _construct(...args);
				}
			};
		};
	}

	return _singleton;
})();
