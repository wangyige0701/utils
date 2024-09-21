import type { PreElements } from '@/types';
import { isBoolean, isRegExp, isString } from '@/is';
import { objectKeys } from '@/object';

export type RegExpFlag = 'g' | 'i' | 'm' | 's' | 'u' | 'y';

export const flags: RegExpFlag[] = ['g', 'i', 'm', 's', 'u', 'y'];

type ToRegExpParams<T extends Array<string | RegExp>> = T['length'] extends 0
	? []
	: T['length'] extends 1
		? T
		: [...PreElements<T>, RegExp | RegExpFlag | {}];

/**
 * Merge the inputs to a full RegExp, if the length of input upper than one,
 * the last param can be parse to RegExp flag (contain the combination of the flags).
 * - If the last param is a RegExp or a string which match the format of RegExp,
 * and it has one of the flags, the flag will be used to the result.
 * Otherwise, all of the param's flag will be igonred.
 */
export const toRegExp = (() => {
	const matchRegExp = new RegExp(
		`^\\/(?<core>.*)\\/(?<flag>[${flags.join('')}]*)$`,
	);
	const matchFlags = new RegExp(
		`^${flags.map(i => `(?!.*${i}.*${i})`).join('')}[${flags.join('')}]{1,6}$`,
	);
	function _parse(rgx: string | RegExp, last: boolean): string | string[] {
		const str = rgx.toString();
		if (isRegExp(rgx)) {
			const lastIndex = str.lastIndexOf('/');
			const core = str.slice(1, lastIndex);
			const flag = str.slice(lastIndex + 1);
			if (last && flag) {
				return [core, flag];
			}
			return core;
		}
		const match = str.match(matchRegExp);
		if (match) {
			const { core, flag } = match.groups || {};
			if (last && flag) {
				return [core, flag];
			}
			return core;
		}
		return str;
	}
	function _checkFlag(s: string) {
		return matchFlags.test(s);
	}
	return function toRegExp<T extends Array<string | RegExp>>(
		...vals: ToRegExpParams<T>
	): RegExp {
		const length = vals.length;
		if (length === 0) {
			return new RegExp('');
		}
		const str = vals
			.map((val, i) => _parse(val as string | RegExp, length === i + 1))
			.flat(1)
			.filter(Boolean);
		const flag = str.length > 1 ? str.pop()! : '';
		if (flag) {
			if (!_checkFlag(flag)) {
				str.push(flag);
			} else {
				return new RegExp(str.join(''), flag);
			}
		}
		return new RegExp(str.join(''));
	};
})();

type SettingFlag = Partial<Record<RegExpFlag, boolean>> | RegExpFlag | boolean;

/**
 * Setting the flags of a regexp.
 * @param setting The flags to set, it can be a flag string, boolean or an object for flag map to boolean.
 * If setting boolean, all of the flags will be set to this value.
 */
export function settingFlags(r: RegExp, setting?: SettingFlag) {
	if (!isRegExp(r)) {
		throw new TypeError('`r` must be a RegExp');
	}
	if (isString(setting)) {
		if (!flags.includes(setting as RegExpFlag)) {
			throw new TypeError('`setting` must be a RegExpFlag');
		}
		setting = { [setting]: true };
	}
	if (isBoolean(setting)) {
		const v = setting;
		setting = {};
		for (const flag of flags) {
			setting[flag] = v;
		}
	}
	const str = String(r);
	const core = str.slice(0, str.lastIndexOf('/') + 1);
	const values = flags.reduce(
		(prev, curr) => {
			prev[curr] = setting?.[curr] ?? false;
			return prev;
		},
		{} as Record<RegExpFlag, boolean>,
	);
	return toRegExp(
		objectKeys(values).reduce((prev, curr) => {
			if (values[curr] === true) {
				prev += curr;
			}
			return prev;
		}, core),
	);
}
