export class UseQueue<T = any> {
	#queue: T[] = [];

	constructor(...args: T[]) {
		this.#queue.push(...args);
	}

	enQueue(...args: T[]) {
		this.#queue.push(...args);
	}

	get deQueue() {
		return this.#queue.shift();
	}

	clear() {
		this.#queue.length = 0;
	}

	get length() {
		return this.#queue.length;
	}
}
