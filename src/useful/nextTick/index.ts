import type { Fn } from '@/types';
import { isDef, isFunction } from '@/is';
import { getGlobal } from '@/env';

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

	if (
		isDef(getGlobal().process) &&
		isFunction(getGlobal().process.nextTick)
	) {
		_use = () => {
			getGlobal().process.nextTick(flushTasks);
		};
	} else if (isFunction(getGlobal().Promise)) {
		const _resolve = getGlobal().Promise.resolve();
		_use = () => {
			_resolve.then(flushTasks);
		};
	} else if (isFunction(getGlobal().MutationObserver)) {
		let counter = 1;
		const _ob = new (getGlobal().MutationObserver)(flushTasks);
		const _node = document.createTextNode(String(counter));
		_ob.observe(_node, { characterData: true });
		_use = () => {
			counter = (counter + 1) % 2;
			_node.data = String(counter);
		};
	} else if (isFunction(getGlobal().setImmediate)) {
		_use = () => {
			getGlobal().setImmediate(flushTasks);
		};
	} else {
		_use = () => {
			getGlobal().setTimeout(flushTasks, 0);
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
