import { callbackForFilter, collect, toNumber, valueOf } from "./helpers";

export abstract class Collection<T, V> implements Iterator<V>, Iterable<V> {

    protected index: number = 0;

    abstract all(): T | T[];
    abstract chunk(size: number): Collection<V[], V[]>;
    abstract count(): number;
    abstract map<R>(callback: ((value: V, key: string) => R)): Collection<R, R>;
    abstract push(...values: V[]): Collection<T, V>;
    abstract put(key: string, value: any): Collection<T, V>;
    abstract value<R>(key: string, defaultValue?: R): R;

    get length(): number {
        return this.count();
    }

    [Symbol.iterator](): Iterator<V, any, undefined> {
        this.index = 0;
        return this;
    }

    next(): IteratorResult<V> {
        const items = this.values().all() as V[];
        return this.index < items.length ? {
            done: this.index == items.length - 1,
            value: items[this.index++],
        } : { done: true, value: null };
    }

    average(key?: string): number {
        return this.avg(key);
    }

    avg(key?: string): number {
        return this.sum(key) / this.length;
    }

    chunkWhile(callback: ((value: any, index: string, chunk: Collection<T, V>) => boolean)) {
        const chunks: any[][] = [];
        this.each((v, k) => {
            if (callback(v, k, collect(chunks.length > 0 ? chunks[chunks.length - 1] : []))) {
                chunks[chunks.length - 1].push(v);
            } else {
                chunks.push([v]);
            }
        });
        return collect(chunks);
    }

    collapse<R>() {
        return collect((this.all() as any[]).flat() as R[]);
    }

    collect() {
        return collect(this.all());
    }

    combine<R>(items: R[]) {
        const newObject: any = {};
        this.each((v, k) => {
            newObject[v] = typeof items[parseInt(k)] == 'undefined' ? null : items[parseInt(k)];
        });
        return collect(newObject);
    }

    contains(valueOrCallback: V | ((v: any, k: string) => boolean)): boolean {
        if (typeof valueOrCallback == 'function') {
            let result = false;
            this.each((v: any, k) => {
                if ((valueOrCallback as ((v: any, k: string) => boolean))(v, k)) {
                    result = true;
                    return false;
                }
            });
            return result;
        } else {
            return (this.values().all() as V[]).includes(valueOrCallback);
        }
    }

    containsOneItem() {
        return this.length == 1;
    }

    each(callback: ((value: V, key: string) => boolean | void)) {
        for (let [i, v] of this.entries()) {
            const result = callback(v, i);
            if (result === false) {
                break;
            }
        }
    }

    entries(): [string, V][] {
        return Object.entries(this.all() as any);
    }

    filter(callback?: ((value: V, key: string) => boolean)): Collection<V, V> {
        callback = callback ?? Boolean;
        const result: V[] = [];
        this.each((v, k) => {
            if (callback!(v, k)) {
                result.push(v);
            }
        });
        return collect(result);
    }

    first(callback?: ((value: V, key: string) => boolean)): V | null {
        if (callback === undefined) {
            const entries = this.entries();
            if (entries.length > 0) {
                return entries[0][1];
            }
            return null;
        } else {
            let result: V | null = null;
            this.each((v, k) => {
                if (callback(v, k)) {
                    result = v;
                    return false;
                }
            });
            return result;
        }
    }

    get<R>(key: string, defaultValue?: R) {
        const filtered = this.entries().filter(v => v[0] == key);
        if (filtered.length > 0) {
            return filtered[0][1];
        }
        return valueOf(defaultValue);
    }

    keyBy<R>(key: string | ((value: V, key: string) => string)): Collection<R, R> {
        const newObject: any = {};
        if (typeof key == 'string') {
            this.each((v, k) => {
                if (typeof (v as any)[key] != 'undefined') {
                    newObject[(v as any)[key]] = v;
                }
            });
        } else {
            this.each((v, k) => {
                const strKey = key(v, k);
                if (typeof strKey == 'string') {
                    newObject[strKey] = v;
                }
            });
        }
        return collect(newObject);
    }

    keys(): Collection<string, string> {
        return collect(this.entries().map((v) => v[0]));
    }

    last(callback?: ((value: V, key: string) => boolean)): V | null {
        const entries = this.entries();
        if (callback === undefined) {
            if (entries.length > 0) {
                return entries[entries.length - 1][1];
            }
            return null;
        } else {
            let result: V | null = null;
            for (let i = entries.length - 1; i >= 0; i--) {
                if (callback(entries[i][1], entries[i][0])) {
                    result = entries[i][1];
                    break;
                }
            }
            return result;
        }
    }

    max(): number {
        return Math.min(...(this.values().all() as any[]).map(parseFloat).filter((v) => !isNaN(v)));
    }

    pluck(valueField: string, keyField?: string) {
        const result: any[] | any = typeof keyField == 'undefined' ? [] : {};
        this.each((v, k) => {
            const record = collect(v);
            if (Array.isArray(result)) {
                result.push(record.get(valueField));
            } else {
                result[record.get(keyField!)] = record.get(valueField);
            }
        });
        return collect(result);
    }

    random() {
        const entries = this.entries();
        const randomEntry = entries[Math.floor(Math.random() * entries.length)];
        return randomEntry[1];
    }

    reduce<R>(callback: ((previousValue: R, value: V, key?: string) => R), initialValue: R) {
        this.each((v: V, k: string) => {
            initialValue = callback(initialValue, v, k);
        });
        return initialValue;
    }

    sum(key?: string | ((item: V) => number)): number {
        if (key === undefined || typeof key === 'string') {
            return this.reduce((pv: number, cv: V) => pv + toNumber(key === undefined ? cv : (cv as any)[key]), 0) as number;
        } else {
            return this.values().map(key).reduce((pv: number, cv: number) => pv + cv, 0);
        }
    }

    values(): Collection<V, V> {
        return collect(this.entries().map((v) => v[1]));
    }

    where(key: string | ((value: V, key: string) => boolean), operator?: any, value?: any) {
        return this.filter(callbackForFilter(key, operator, value));
    }

    whereBetween(key: string, range: [number, number]) {
        return this.where(key, 'between', range);
    }

    whereIn<R>(key: string, items: R[]) {
        return this.where(key, 'in', items);
    }

    whereNotBetween(key: string, range: [number, number]) {
        return this.where(key, 'not_between', range);
    }

    whereNotIn<R>(key: string, items: R[]) {
        return this.where(key, 'not_in', items);
    }

    whereNotNull(key: string) {
        return this.where(key, '!==', null);
    }

    whereNull(key: string) {
        return this.where(key, '===', null);
    }
}
