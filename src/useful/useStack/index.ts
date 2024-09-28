export class UseStack<T = any> {
	#stack: T[] = [];

	constructor(...args: T[]) {
		this.#stack.push(...args);
	}

	push(...args: T[]) {
		this.#stack.push(...args);
	}

	get pop() {
		return this.#stack.pop();
	}

	clear() {
		this.#stack.length = 0;
	}

	get length() {
		return this.#stack.length;
	}
}
