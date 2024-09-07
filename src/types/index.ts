export type Arrayable<T> = T | Array<T>;

export type Awaitable<T> = T | PromiseLike<T>;

export type Nullable<T> = T | null | undefined;

/**
 * Custom type for function
 * @param P function parameters
 * @param T function return type
 */
export type Fn<P extends any[] = [], T = void> = (...args: P) => T;

/**
 * Custom type for async function
 */
export type AwaitableFn<T extends Fn<any[], any>> =
	| T
	| Fn<Parameters<T>, Awaitable<ReturnType<T>>>;

export type Constructor<T> = new (...args: any[]) => T;

export type Elementof<T> = T extends (infer E)[] ? E : never;

/**
 * The type of the resolve function of a promise
 */
export type PromiseResolve<T = any> = Fn<[value: T]>;

/**
 * The type of the reject function of a promise
 */
export type PromiseReject = Fn<[reason: any]>;

/**
 * Pick the types for value from an object
 * @example
 * ```typescript
 * type A = { a: number; b: string; c: boolean; }
 * type B = PickValues<A, string | number>;
 * // B is { a: number; b: string; }
 * ```
 */
export type PickValues<T extends object, K> = {
	[P in keyof T as T[P] extends K ? P : never]: T[P];
};

/**
 * omit the types for value from an object
 */
export type OmitValues<T extends object, K> = {
	[P in keyof T as T[P] extends K ? never : P]: T[P];
};

/**
 * Make some properties of an object optional, and the rest of the properties are keeped
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// prettier-ignore
/**
 * Make some properties of an object optional, and the rest of the properties are required
 */
export type PartialOptional<T, K extends keyof T> = Omit<Required<T>, K> & Partial<Pick<T, K>>;

export type RemoveReadonly<T> = {
	-readonly [P in keyof T]: T[P];
};

export type DeepPartial<T> = T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

export type DeepRequired<T> = T extends object
	? { [P in keyof T]-?: DeepRequired<T[P]> }
	: T;

export type FirstElement<T extends any[]> = T extends []
	? undefined
	: T extends [infer F]
		? F
		: T extends [infer F, ...any[]]
			? F
			: never;

export type LastElement<T extends any[]> = T extends []
	? undefined
	: T extends [infer L]
		? L
		: T extends [...any[], infer L]
			? L
			: never;

export type RestElement<T extends any[]> = T extends [any, ...infer R] ? R : [];

/**
 * Make all elements of a params array optional
 */
export type ElementsOptional<
	T extends any[],
	F = FirstElement<T>,
> = T extends [] ? [] : [F?, ...ElementsOptional<RestElement<T>>];

/**
 * Extract elements of a specific length from an array
 */
export type ExtractElements<
	Length extends number,
	T extends any[],
	V extends any[] = [],
> = V['length'] extends Length
	? V
	: ExtractElements<Length, RestElement<T>, [...V, FirstElement<T>]>;

/**
 * Extract the rest of the elements from an array after extracting a specific length
 */
export type ExtractRest<Length extends number, T extends any[]> = T extends [
	...ExtractElements<Length, T>,
	...infer R,
]
	? R
	: never;
