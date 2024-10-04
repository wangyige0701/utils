/**
 * Get the environment variable, default is `zh-CN`,
 * in chrome will use `navigator.language` to get the language in setting.
 */
export const languageInfo = (() => {
	let env = 'zh-CN';
	if (typeof window !== 'undefined' && window.navigator) {
		env = window.navigator.language;
	}
	return {
		get value() {
			return env;
		},
		get() {
			return env;
		},
		set(value: string) {
			env = value;
		},
	};
})();

/**
 * Get the global object both in node and browser.
 * - default is `globalThis`.
 * - if `globalThis` is not defined, use `global`.
 * - if `global` is not defined, use `window`.
 */
export const globalVar = (() => {
	if (typeof globalThis !== 'undefined') {
		return globalThis;
	} else if (typeof global !== 'undefined') {
		return global;
	}
	return window;
})();
