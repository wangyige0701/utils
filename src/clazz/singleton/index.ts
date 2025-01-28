import type {
	Constructor,
	ExcludeElements,
	Fn,
	ParamatersOptional,
} from '@/types';
import { isDef, isFunction } from '@/is';
import { getGlobal } from '@/env';

type Singleton<
	T extends Constructor<any, any[]>,
	P extends ConstructorParameters<T>,
	Params extends ParamatersOptional<P>,
> = Params['length'] extends 0
	? T
	: Constructor<InstanceType<T>, ExcludeElements<P, Params>>;

/**
 * Create a singleton class,
 * the instance of the class which proxy by this function will modify the constructor,
 * so that the instance which create by the constructor is still the same singleton.
 * - When use `new` to create an instance, it will check the params of the constructor,
 * and the check rule is only use strict equality to compare.
 * - singleton function can setting the params of the constructor,
 * and the return constructor's params are the rest params of the origin constructor.
 * @param fixArgs - Fix some params of the constructor when create the singleton instance.
 */
export const singleton = (() => {
	let singleton: <
		T extends Constructor<any, any[]>,
		P extends ConstructorParameters<T>,
		Params extends ParamatersOptional<P>,
	>(
		clazz: T,
		...fixArgs: Params
	) => Singleton<T, P, Params>;

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

	function createConstructor<T extends Constructor<any, any[]>>(
		clazz: T,
		proxy: boolean,
		fixArgs: any[],
	): Fn<any[], T> {
		let instance: T;
		const params: any[] = [];
		function _construct(this: any, ...args: any[]) {
			if (new.target === _construct || this instanceof _construct) {
				return _construct(...fixArgs, ...args);
			}
			if (!instance) {
				params.push(...args);
				if (!proxy) {
					instance = new clazz(...args);
					if ((instance as any).__proto__) {
						(instance as any).__proto__.constructor = _construct;
					} else {
						instance.constructor = _construct;
					}
				} else {
					instance = new (getGlobal().Proxy)(new clazz(...args), {
						get(target, p) {
							if (p === 'constructor') {
								return _construct;
							}
							const result = Reflect.get(target, p);
							if (isFunction(result)) {
								return result.bind(target);
							}
							return result;
						},
					});
				}
			}
			paramsCheck(params, args);
			return instance;
		}
		return _construct;
	}

	if (isDef(getGlobal().Proxy)) {
		singleton = <
			T extends Constructor<any, any[]>,
			P extends ConstructorParameters<T>,
			Params extends ParamatersOptional<P>,
		>(
			clazz: T,
			...fixArgs: Params
		) => {
			const _construct = createConstructor(clazz, true, fixArgs);
			const ins = new (getGlobal().Proxy)(
				clazz as Singleton<T, P, Params>,
				{
					construct(_, args) {
						return _construct(...fixArgs, ...args);
					},
					get(target, p) {
						if (p === 'prototype') {
							const proto = Reflect.get(target, p);
							if (proto.constructor !== ins) {
								proto.constructor = ins;
							}
							return proto;
						}
						return Reflect.get(target, p);
					},
				},
			);
			return ins;
		};
	} else {
		singleton = <
			T extends Constructor<any, any[]>,
			P extends ConstructorParameters<T>,
			Params extends ParamatersOptional<P>,
		>(
			clazz: T,
			...fixArgs: Params
		) => {
			const _construct = createConstructor(clazz, false, fixArgs);
			const ins = <Singleton<T, P, Params>>class {
				constructor(...args: any[]) {
					return _construct(...fixArgs, ...args);
				}
			};
			ins.prototype.constructor = ins;
			for (const key of Object.getOwnPropertyNames(clazz)) {
				if (key === 'prototype' || key === 'length' || key === 'name') {
					continue;
				}
				if (clazz.hasOwnProperty(key)) {
					(ins as any)[key] = (clazz as any)[key];
				}
			}
			return ins;
		};
	}
	return singleton;
})();
