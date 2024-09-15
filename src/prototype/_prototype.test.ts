import { describe, it, expect } from 'vitest';
import { toPrimitiveString } from '@/prototype';

describe('prototype', () => {
	it('toPrimitiveString', () => {
		expect(toPrimitiveString('1')).toBe('[object String]');
		expect(toPrimitiveString(1)).toBe('[object Number]');
		expect(toPrimitiveString(true)).toBe('[object Boolean]');
		expect(toPrimitiveString(null)).toBe('[object Null]');
		expect(toPrimitiveString(undefined)).toBe('[object Undefined]');
		expect(toPrimitiveString(Symbol('1'))).toBe('[object Symbol]');
		expect(toPrimitiveString({})).toBe('[object Object]');
		expect(toPrimitiveString([])).toBe('[object Array]');
		expect(toPrimitiveString(() => {})).toBe('[object Function]');
		expect(toPrimitiveString(new Date())).toBe('[object Date]');
	});
});
