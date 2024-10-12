/**
 * - If environment has `navigotor.language` property, the result will return it.
 * - Otherwise, the result will use custom variable.
 * - Default value is `zh-CN`.
 */
export const language = (() => {
	let env = 'zh-CN';
	const hasNavigator = typeof window !== 'undefined' && window.navigator;
	let getEnv = () => env;
	if (hasNavigator) {
		getEnv = () => window.navigator.language;
	}
	return {
		get() {
			return getEnv();
		},
		set(value: string) {
			if (!hasNavigator) {
				env = value;
			}
		},
	};
})();

/**
 * Get the global object both in node and browser.
 * - default is `globalThis`.
 * - if `globalThis` is not defined, use `self`.
 * - if `self` is not defined, use `global`.
 * - if `global` is not defined, use `window`.
 */
export const getGlobal = (() => {
	let globalValue: typeof globalThis;
	function getGlobal() {
		if (typeof globalThis !== 'undefined') {
			return globalThis;
		} else if (typeof self !== 'undefined') {
			return self;
		} else if (typeof window !== 'undefined') {
			return window;
		} else if (typeof global !== 'undefined') {
			return global;
		}
		return {} as unknown as typeof globalThis;
	}
	return () => {
		if (!globalValue) {
			globalValue = getGlobal();
		}
		return globalValue;
	};
})();
