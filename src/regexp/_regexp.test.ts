import { describe, it, expect } from 'vitest';
import { toRegExp, settingFlags } from '@/regexp';

describe('regexp', () => {
	it('toRegExp', () => {
		expect(toRegExp('abc')).toEqual(/abc/);
		expect(toRegExp('abc', 'i')).toEqual(/abc/i);
		expect(toRegExp(/abc/)).toEqual(/abc/);
		expect(toRegExp(/abc/, 'g')).toEqual(/abc/g);
		expect(toRegExp(/abc/g)).toEqual(/abc/g);
		expect(toRegExp(/abc/g, 'm')).toEqual(/abc/m);
		expect(toRegExp('/abc/g')).toEqual(/abc/g);
		expect(toRegExp('/abc/g', 'i')).toEqual(/abc/i);
		expect(toRegExp(/abc/, 'def', 'g')).toEqual(/abcdef/g);
		expect(toRegExp(/abc/, 'def', 'gmis')).toEqual(/abcdef/gims);
		expect(toRegExp('/abc/gmisuy')).toEqual(/abc/gimsuy);
		expect(toRegExp(/abc/gimsuy)).toEqual(/abc/gimsuy);
		expect(toRegExp('^(?=', /abc/, ')', '$')).toEqual(/^(?=abc)$/);
	});

	it('settingFlags', () => {
		const reg = /abc/;
		const a = settingFlags(reg, { i: true });
		expect(a).toEqual(/abc/i);
		const b = settingFlags(a, { g: true });
		expect(b).toEqual(/abc/g);
		const c = settingFlags(b, { g: false, m: true });
		expect(c).toEqual(/abc/m);
		const d = settingFlags(c, 'u');
		expect(d).toEqual(/abc/u);
		const e = settingFlags(reg, true);
		expect(e).toEqual(/abc/gimsuy);
		const f = settingFlags(e, false);
		expect(f).toEqual(/abc/);
	});
});
