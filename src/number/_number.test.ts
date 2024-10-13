import { describe, expect, it } from 'vitest';
import {
	addZero,
	validNumber,
	inRange,
	clamp,
	randomInteger,
	matchNumber,
} from '@/number';

describe('number', () => {
	it('addZero', () => {
		expect(addZero(1)).toBe('01');
		expect(addZero(12, 3)).toBe('012');
		expect(addZero('12', 4)).toBe('0012');
	});

	it('validNumber', () => {
		expect(validNumber(1)).toBe(1);
		expect(validNumber('1')).toBe(1);
		expect(validNumber('1.1')).toBe(1.1);
		expect(validNumber('1.3.6')).toBe(1.3);
		expect(validNumber('143abc')).toBe(143);
		expect(validNumber('1.1abc')).toBe(1.1);
		expect(validNumber('true')).toBe(0);
	});

	it('inRange', () => {
		expect(inRange(1, 0, 2)).toBe(true);
		expect(inRange(1, 1, 2)).toBe(true);
		expect(inRange(3, 2, 3)).toBe(true);
		expect(inRange(3, 2, 3, { includeMax: false })).toBe(false);
		expect(inRange(2, 2, 3, { includeMin: false })).toBe(false);
		expect(inRange(-1, 1, 3)).toBe(false);
		expect(inRange(5, 1, 3)).toBe(false);
	});

	it('clamp', () => {
		expect(clamp(1, 0, 2)).toBe(1);
		expect(clamp(1, 1, 2)).toBe(1);
		expect(clamp(1, 2, 5)).toBe(2);
		expect(clamp(4, 1, 3)).toBe(3);
		expect(() => clamp(0, 4, 2)).toThrowError(
			'min should be less than max',
		);
	});

	it('randomInteger', () => {
		function check(...opts: Parameters<typeof randomInteger>) {
			const [min, max, options] = opts;
			const { includeMax = true, includeMin = true } = options || {};
			for (let i = 0; i < 100; i++) {
				const num = randomInteger(min, max, options);
				if (includeMin) {
					expect(num).toBeGreaterThanOrEqual(min);
				} else {
					expect(num).toBeGreaterThan(min);
				}
				if (includeMax) {
					expect(num).toBeLessThanOrEqual(max);
				} else {
					expect(num).toBeLessThan(max);
				}
			}
		}
		check(1, 3);
		check(0, 1);
		check(1, 2, { includeMax: false });
		check(2, 5, { includeMin: false });
		check(1, 3, { includeMin: false, includeMax: false });
	});

	it('matchNumber', () => {
		expect(matchNumber('123')).toBe(true);
		expect(matchNumber('123.45')).toBe(true);
		expect(matchNumber('123.45.67')).toBe(false);
		expect(matchNumber('abc')).toBe(false);
		expect(matchNumber('123abc')).toBe(false);
		expect(matchNumber(123)).toBe(true);
	});
});
