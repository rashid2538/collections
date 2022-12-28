import { Collection } from "./src/collection";

export function toNumber(val: any): number;

export function callbackForFilter<T>(key: string | ((value: T, key: string) => boolean), operator?: any, value?: any): ((value: T, key: string) => boolean);

export function collect<T>(item: T | T[]): Collection<T, T | any>;

export function iterate<T>(arr: T[] | any, callback: ((v: T, k: string) => void)): void;

export function safeGet<V>(target: any[] | any, key?: string | string[], defaultValue?: V): V | undefined;

export function valueOf(val: any, ...args: any[]): any;
