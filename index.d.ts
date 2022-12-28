import { Collection } from "./src/collection";

/**
 * Creates a callback for the filter function depending upon the arguments.
 * @param key Key to look for the filter.
 * @param operator Operator to be used during filteration.
 * @param value Value against which the comparison will take place. If omitted then operator will be `=` and value will be used from previous argument.
 * @returns `(value: T, key: string) => boolean`
 */
export function callbackForFilter<T>(key: string | ((value: T, key: string) => boolean), operator?: any, value?: any): ((value: T, key: string) => boolean);

/**
 * Create a new collection based on the iterable, array or object passed.
 * @param item An array or object to be collected.
 * @returns `Collection<T, T | any>
 */
export function collect<T>(item: T | T[]): Collection<T, T | any>;

/**
 * Creates a callback for the equality check for a value.
 * @param value Value to be checked for equality.
 * @returns `(item: T) => boolean`
 */
export function equality<T>(value: T): (item: T) => boolean;

/**
 * Iterates an array via a callback.
 * @param arr Array to iterate.
 * @param callback Callback to be used for the iteration.
 */
export function iterate<T>(arr: T[] | any, callback: ((v: T, k: string) => void)): void;

/**
 * Creates a negating callback for the callback passed.
 * @param callback Callback to be negated.
 * @returns (...params: any[]) => boolean
 */
export function negate(callback: Function): (...params: any[]) => boolean;

/**
 * Creates a collection with integers from `start` to `end`.
 * @param start Number to start from.
 * @param end Number to end at.
 * @returns Collection<number, number>
 */
export function range(start: number, end: number): Collection<number, number>;

/**
 * Returns the value from the array or object based on the key.
 * @param target Value to be retrieved from.
 * @param key Key to look up in the target.
 * @param defaultValue Default value in case key was not found.
 * @returns any
 */
export function safeGet<V>(target: any[] | any, key?: string | string[], defaultValue?: V): V | undefined;

/**
 * Converts the passed value to a number (can return a NaN).
 * @param val Value to convert to a number.
 * @returns number
 */
export function toNumber(val: any): number;

/**
 * Parses the value of the item passed.
 * @param val Value to be evaluated.
 * @param args Arguments to be passed to the callback.
 * @returns any
 */
export function valueOf(val: any, ...args: any[]): any;
