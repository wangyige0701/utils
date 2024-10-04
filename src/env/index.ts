import { singleton } from '@/clazz';
import { isDef } from '@/is';

/**
 * Get the environment variable, default is `zh-CN`,
 * in chrome will use `navigator.language` to get the language in setting.
 */
export const languageInfo = (() => {
	const i = singleton(
		class Language {
			#env = 'zh-CN';

			constructor() {
				if (window && window.navigator) {
					this.#env = window.navigator.language;
				}
			}

			get value() {
				return this.#env;
			}

			get() {
				return this.#env;
			}

			set(value: string) {
				this.#env = value;
			}
		},
	);
	return new i();
})();

/**
 * Get the global object both in node and browser.
 * - default is `globalThis`.
 * - if `globalThis` is not defined, use `global`.
 * - if `global` is not defined, use `window`.
 */
export const globalVar = (() => {
	if (isDef(globalThis)) {
		return globalThis;
	} else if (isDef(global)) {
		return global;
	}
	return window;
})();
