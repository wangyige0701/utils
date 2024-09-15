import type {
	Constructor,
	ExcludeElements,
	Fn,
	ParamatersOptional,
} from '@/types';
import { isUndef } from '@/is';

/**
 * Create a singleton class,
 * the instance of the class which proxy by this function will modify the constructor,
 * so that the instance which create by the constructor is still the same singleton.
 * - When use `new` to create an instance, it will check the params of the constructor,
 * and the check rule is only use strict equality to compare.
 * - singleton function can setting the params of the constructor,
 * and the return constructor's params are the rest params of the origin constructor.
 */
export const singleton = (() => {
	let singleton: <
		T extends Constructor<any, any[]>,
		P extends ConstructorParameters<T>,
		Params extends ParamatersOptional<P>,
	>(
		clazz: T,
		...params: Params
	) => Constructor<InstanceType<T>, ExcludeElements<P, Params>>;

	function paramsCheck(params: any[], args: any[]) {
		if (
			params.length !== args.length ||
			!params.every((item, index) => item === args[index])
		) {
			throw new Error(
				'Singleton class can not be constructed with different parameters\n' +
					`Expected: [${[...params]}]\n` +
					`Actual: [${[...args]}]`,
			);
		}
	}

	function _createConstructor<T extends Constructor<any, any[]>>(
		clazz: T,
		proxy: boolean,
		fixArgs: any[],
	): Fn<any[], T> {
		let _instance: T;
		const params: any[] = [];
		function _construct(this: any, ...args: any[]) {
			if (new.target === _construct || this instanceof _construct) {
				return _construct(...fixArgs, ...args);
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
		singleton = <
			T extends Constructor<any, any[]>,
			P extends ConstructorParameters<T>,
			Params extends ParamatersOptional<P>,
		>(
			clazz: T,
			...params: Params
		) => {
			const _construct = _createConstructor(clazz, true, params);
			return new globalThis.Proxy(
				clazz as Constructor<
					InstanceType<T>,
					ExcludeElements<P, Params>
				>,
				{
					construct(_, args) {
						return _construct(...params, ...args);
					},
				},
			);
		};
	} else {
		singleton = <
			T extends Constructor<any, any[]>,
			P extends ConstructorParameters<T>,
			Params extends ParamatersOptional<P>,
		>(
			clazz: T,
			...params: Params
		) => {
			const _construct = _createConstructor(clazz, false, params);
			return <Constructor<InstanceType<T>, ExcludeElements<P, Params>>>(
				class {
					constructor(...args: any[]) {
						return _construct(...params, ...args);
					}
				}
			);
		};
	}

	return singleton;
})();
