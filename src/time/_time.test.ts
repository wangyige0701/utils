import { describe, expect, it } from 'vitest';
import { delay } from '.';

describe('time', () => {
	it('delay', async () => {
		const start = performance.now();
		await delay(1000);
		const end = performance.now();
		expect(end - start).toBeGreaterThanOrEqual(1000);
	});
});
