import { describe, it, expect, beforeAll, vi, afterAll } from 'vitest';

describe('isInteger without Number.isInteger', () => {
	beforeAll(() => {
		vi.stubGlobal('Number', {
			...Number,
			isFinite: Number.isFinite,
			isInteger: undefined,
		});
	});
	afterAll(() => {
		vi.unstubAllGlobals();
	});
	it('check', async () => {
		const isInteger = (await import('./index')).isInteger;
		expect(Number.isInteger).toBeUndefined();
		expect(isInteger(1)).toBe(true);
		expect(isInteger(-3)).toBe(true);
		expect(isInteger('1')).toBe(false);
		expect(isInteger(2.2)).toBe(false);
	});
});
