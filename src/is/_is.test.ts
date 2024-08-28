import { describe, it, expect } from 'vitest';
import {
	isString,
	isNumber,
	isBoolean,
	isFunction,
	isArray,
	isObject,
	isGeneralObject,
	isUndefined,
	isNull,
	isSymbol,
	isDate,
	isRegExp,
	isBigint,
	isPromise,
	isPromiseLike,
	isInteger,
	isOdd,
	isEven,
} from './index';

const target = {
	str: 'hello',
	num: 111,
	bool: true,
	fun: (a: number) => a,
	obj: { a: 1 },
	arr: [1] as any[],
	date: new Date(),
	reg: /.*/,
	symb: Symbol(),
	null: null,
	und: void 0,
	nan: NaN,
	big: BigInt(1),
	prom: Promise.resolve(),
	thenable: { then: () => {} },
	int: 1,
	nInt: 1.1,
} as const;
type Result = {
	[K in keyof typeof target]?: boolean;
};
function check(fn: Function, result: Result) {
	it(`${fn.name}:check`, () => {
		for (const key in target) {
			let value = false;
			if (key in result) {
				value = result[key as keyof typeof result]!;
			}
			expect(fn(target[key as keyof typeof target])).toBe(value);
		}
	});
}

describe.concurrent('is', () => {
	describe(isString.name, () => {
		check(isString, { str: true });
	});

	describe(isNumber.name, () => {
		check(isNumber, { num: true, nan: true, int: true, nInt: true });
	});

	describe(isBoolean.name, () => {
		check(isBoolean, { bool: true });
	});

	describe(isFunction.name, () => {
		check(isFunction, { fun: true });
	});

	describe(isArray.name, () => {
		check(isArray, { arr: true });
	});

	describe(isObject.name, () => {
		check(isObject, { obj: true, thenable: true });
	});

	describe(isGeneralObject.name, () => {
		check(isGeneralObject, {
			obj: true,
			arr: true,
			prom: true,
			reg: true,
			date: true,
			thenable: true,
		});
	});

	describe(isUndefined.name, () => {
		check(isUndefined, { und: true });
	});

	describe(isNull.name, () => {
		check(isNull, { null: true });
	});

	describe(isSymbol.name, () => {
		check(isSymbol, { symb: true });
	});

	describe(isDate.name, () => {
		check(isDate, { date: true });
	});

	describe(isRegExp.name, () => {
		check(isRegExp, { reg: true });
	});

	describe(isBigint.name, () => {
		check(isBigint, { big: true });
	});

	describe(isPromise.name, () => {
		check(isPromise, { prom: true });
	});

	describe(isPromiseLike.name, () => {
		check(isPromiseLike, { prom: true, thenable: true });
	});

	describe('isInteger', () => {
		check(isInteger, { num: true, int: true, nInt: false });
	});

	describe(isOdd.name, () => {
		it(`${isOdd.name}:check`, () => {
			expect(isOdd(1)).toBe(true);
			expect(isOdd(2)).toBe(false);
		});
	});

	describe(isEven.name, () => {
		it(`${isEven.name}:check`, () => {
			expect(isEven(1)).toBe(false);
			expect(isEven(2)).toBe(true);
		});
	});
});
