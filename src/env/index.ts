import { singleton } from '@/clazz';

/**
 * Get the environment variable, default is zh-CN,
 * in chrome use `navigator.language`,
 */
export const languageInfo = (() => {
	const i = singleton(
		class Language {
			#env = 'zh-CN';

			constructor() {
				if (globalThis.navigator) {
					this.#env = globalThis.navigator.language;
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
