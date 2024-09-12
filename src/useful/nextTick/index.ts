import type { Fn } from '@/types';
import { isDef, isFunction } from '@/is';

export const nextTick = (() => {
	let pending: boolean = false;
	let _use: Fn<[], any>;
	const tasks: Fn[] = [];

	function flushTasks() {
		pending = false;
		const executes = tasks.splice(0);
		for (const task of executes) {
			task?.();
		}
	}

	if (isDef(globalThis.process) && isFunction(globalThis.process.nextTick)) {
		_use = () => {
			globalThis.process.nextTick(flushTasks);
		};
	} else if (isFunction(globalThis.Promise)) {
		const _resolve = globalThis.Promise.resolve();
		_use = () => {
			_resolve.then(flushTasks);
		};
	} else if (isFunction(globalThis.MutationObserver)) {
		let counter = 1;
		const _ob = new globalThis.MutationObserver(flushTasks);
		const _node = document.createTextNode(String(counter));
		_ob.observe(_node, { characterData: true });
		_use = () => {
			counter = (counter + 1) % 2;
			_node.data = String(counter);
		};
	} else if (isFunction(globalThis.setImmediate)) {
		_use = () => {
			globalThis.setImmediate(flushTasks);
		};
	} else {
		_use = () => {
			globalThis.setTimeout(flushTasks, 0);
		};
	}

	return function nextTick<P extends any[]>(cb: Fn<P, any>, ...params: P) {
		if (!isFunction(cb)) {
			throw new TypeError('nextTick callback must be a function');
		}
		tasks.push(() => {
			cb(...params);
		});
		if (!pending) {
			pending = true;
			_use();
		}
	};
})();
