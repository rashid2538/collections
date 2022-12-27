type CollectionItemType<T> = any | T[];

export class Collection<T> implements Iterable<any>, Iterator<any> {

    private currentIndex: number = 0;
    private items: CollectionItemType<T>;
    private isArray = true;

    constructor(items: T[] | any) {
        this.isArray = Array.isArray(items);
        this.items = items;
    }

    private get itemsAsArray(): T[] {
        return this.items as T[];
    }

    private get itemsAsObject(): any {
        return this.items as any;
    }

    get length(): number {
        return this.isArray ? this.itemsAsArray.length : Object.keys(this.itemsAsObject).length;
    }

    [Symbol.iterator](): Iterator<T, any, undefined> {
        this.currentIndex = 0;
        return this;
    }

    next(...args: [] | [undefined]): IteratorResult<T, any> {
        if (this.currentIndex < this.length) {
            return {
                value: this.isArray ? this.itemsAsArray[this.currentIndex++] : this.itemsAsObject.get(this.keys().get('' + this.currentIndex++)!)!,
                done: this.currentIndex == this.length,
            };
        }
        return {
            value: null,
            done: true,
        };
    }

    /**
     * Returns the underlying array represented by the collection.
     * @returns T[]
     */
    all(): T[] | T {
        return this.isArray ? this.itemsAsArray : this.itemsAsObject;
    }

    /**
     * Alias for the avg method.
     * @param key 
     * @returns number
     */
    average(key?: string): number {
        return this.avg(key);
    }

    /**
     * Returns the average value of a given key.
     * @param key string|undefined
     * @returns 
     */
    avg(key?: string): number {
        return this.sum(key) / this.length;
    }

    chunk(size: number): Collection<T[]> {
        if (this.isArray) {
            return collect(this.itemsAsArray.reduce((acc: T[][], val: T, ind: number) => {
                const subIndex = Math.floor(ind / size);
                if (acc.length == subIndex) {
                    acc.push([val]);
                } else {
                    acc[subIndex].push(val);
                }
                return acc;
            }, []));
        } else {
            const keys = this.keys().all() as string[];
            return collect(keys.reduce((acc: any[], key: string, ind: number) => {
                const subIndex = Math.floor(ind / size);
                if (acc.length == subIndex) {
                    acc.push({
                        [key]: this.itemsAsObject[key],
                    });
                } else {
                    acc[subIndex][key] = this.itemsAsObject[key];
                }
                return acc;
            }, [] as any[]));
        }
    }

    chunkWhile(callback: ((value: any, index: string, chunk: Collection<T>) => boolean)) {
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

    collapse<V>() {
        return collect((this.all() as any[]).flat() as V[]);
    }

    collect() {
        return collect(this.isArray ? this.itemsAsArray : this.itemsAsObject);
    }

    combine<V>(items: V[]) {
        const newObject: any = {};
        this.each((v, k) => {
            newObject[v] = typeof items[parseInt(k)] == 'undefined' ? null : items[parseInt(k)];
        });
        return collect(newObject);
    }

    contains(valueOrCallback: T | ((v: any, k: string) => boolean)) {
        if (typeof valueOrCallback == 'string') {
            return this.isArray ? this.itemsAsArray.includes(valueOrCallback) : Object.values(this.itemsAsObject).includes(valueOrCallback);
        } else {
            let result = false;
            this.each((v: any, k) => {
                if ((valueOrCallback as ((v: any, k: string) => boolean))(v, k)) {
                    result = true;
                    return false;
                }
            });
            return result;
        }
    }

    each(callback: ((value: any, key: string) => boolean | void)) {
        if (this.isArray) {
            for (let [i, v] of this.itemsAsArray.entries()) {
                const result = callback(v, i + '');
                if (result === false) {
                    break;
                }
            }
        } else {
            for (let [key, value] of Object.entries(this.itemsAsObject)) {
                const result = callback(value, key);
                if (result === false) {
                    break;
                }
            }
        }
    }

    filter(callback?: ((value: T, key: string) => boolean)): Collection<T> {
        callback = callback ?? Boolean;
        if (this.isArray) {
            return collect(this.itemsAsArray.filter((v, i) => callback!(v, i + '')));
        } else {
            const resultObject: any = {};
            this.each((v, k) => {
                if (callback!(v, k)) {
                    resultObject[k] = v;
                }
            });
            return collect(resultObject);
        }
    }

    first(callback?: ((value: any, key: string) => boolean)): any | null {
        if (callback === undefined) {
            if (this.isArray) {
                return this.length > 0 ? this.itemsAsArray[0] : null;
            } else {
                return this.length > 0 ? this.itemsAsObject[Object.keys(this.itemsAsObject)[0]] : null;
            }
        } else {
            const keys = this.keys();
            for (let keyIndex = 0; keyIndex < this.length; keyIndex++) {
                const key = this.isArray ? (keyIndex + '') : keys.get<string>(keyIndex + '');
                const value = this.get(key);
                if (callback(value, key)) {
                    return value;
                }
            }
        }
        return null;
    }

    get<V>(key: string, defaultValue?: V) {
        if (this.isArray) {
            const intKey = parseInt(key);
            if (intKey < this.length) {
                return this.itemsAsArray[intKey];
            }
        } else {
            if (typeof this.itemsAsObject[key] != 'undefined') {
                return this.itemsAsObject[key];
            }
        }
        return defaultValue;
    }

    keyBy<V>(key: string | ((value: any, key: string) => string)): Collection<V> {
        const newObject: any = {};
        if (typeof key == 'string') {
            this.each((v, k) => {
                if (typeof v[key] != 'undefined') {
                    newObject[v[key]] = v;
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

    keys(): Collection<string> {
        return collect(Object.keys(this.items));
    }

    last(callback?: ((value: any, key: string) => boolean)): any | null {
        if (callback === undefined) {
            if (this.isArray) {
                return this.length > 0 ? this.itemsAsArray[this.length - 1] : null;
            } else {
                const keys = Object.keys(this.itemsAsObject);
                return this.length > 0 ? this.itemsAsObject[keys[keys.length - 1]] : null;
            }
        } else {
            const keys = this.keys();
            for (let keyIndex = this.length - 1; keyIndex > -1; keyIndex--) {
                const key = this.isArray ? (keyIndex + '') : keys.get<string>(keyIndex + '');
                const value = this.get(key);
                if (callback(value, key)) {
                    return value;
                }
            }
        }
        return null;
    }

    map<V>(callback: ((value: T, key: string) => V)): Collection<V> {
        if (this.isArray) {
            return collect(this.itemsAsArray.map((v, k) => callback(v, k + '')));
        } else {
            const newObj: any = {};
            this.each((v, k) => {
                newObj[k] = callback(v, k);
            });
            return collect(newObj);
        }
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
        return result;
    }

    push(...values: T[]) {
        if (this.isArray) {
            this.itemsAsArray.push(...values);
        } else {
            Collection.iterate(values, (v, k) => {
                this.items[k] = v;
            });
        }
        return this;
    }

    put(key: string, value: any) {
        if (this.isArray) {
            const intKey = parseInt(key);
            if (intKey < this.length) {
                this.itemsAsArray[intKey] = value;
            } else {
                this.itemsAsArray.push(value);
            }
        } else {
            this.itemsAsObject[key] = value;
        }
        return this;
    }

    random() {
        const keys = this.keys().all();
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return this.items.get(randomKey);
    }

    reduce<V>(callback: ((previousValue: V, value: any, key?: string) => V), initialValue: V) {
        this.each((v: T, k: string) => {
            initialValue = callback(initialValue, v, k);
        });
        return initialValue;
    }

    sum(key?: string | ((item: any) => number)): number {
        if (key === undefined || typeof key === 'string') {
            return this.reduce((pv: number, cv: any) => pv + (key === undefined ? (cv as number) : (cv[key] as number)), 0) as number;
        } else {
            return this.values().map(key).reduce((pv: number, cv: number) => pv + cv, 0);
        }
    }

    value<V>(key: string, defaultValue?: V) {
        if (this.isArray) {
            const intKey = parseInt(key);
            if (intKey < this.length) {
                return Collection.value(this.itemsAsArray[intKey]);
            }
        } else {
            if (typeof this.itemsAsObject[key] != 'undefined') {
                return Collection.value(this.itemsAsObject[key]);
            }
        }
        return defaultValue;
    }

    values(): Collection<T> {
        return collect(this.isArray ? this.itemsAsArray : Object.values(this.itemsAsObject));
    }

    where(key: string | ((value: T, key: string) => boolean), operator?: any, value?: any) {
        return this.filter(this.callbackForFilter(key, operator, value));
    }

    whereBetween(key: string, range: [number, number]) {
        return this.where(key, 'between', range);
    }

    whereIn(key: string, items: any[]) {
        return this.where(key, 'in', items);
    }

    whereNotBetween(key: string, range: [number, number]) {
        return this.where(key, 'not_between', range);
    }

    whereNotIn(key: string, items: any[]) {
        return this.where(key, 'not_in', items);
    }

    whereNotNull(key: string) {
        return this.where(key, '!==', null);
    }

    whereNull(key: string) {
        return this.where(key, '===', null);
    }

    private static iterate<T>(arr: T[] | any, callback: ((v: T, k: string) => void)) {
        const indexes = Object.keys(arr);
        for (let index of indexes) {
            callback(arr[index], index);
        }
    }

    private callbackForFilter(key: string | ((value: T, key: string) => boolean), operator?: any, value?: any): ((value: T, key: string) => boolean) {
        if (typeof key != 'string') {
            return key;
        }
        if (typeof operator == 'undefined' && typeof value == 'undefined') {
            value = true;
            operator = '=';
        }
        if (typeof value == 'undefined') {
            value = operator;
            operator = '=';
        }

        return (v: any, k: string) => {
            const retrieved: any = Collection.safeGet(v, key);
            switch (operator) {
                default:
                case '=':
                case '==':
                    return retrieved == value;
                case '!=':
                case '<>':
                    return retrieved != value;
                case '<':
                    return retrieved < value;
                case '>':
                    return retrieved > value;
                case '<=':
                    return retrieved <= value;
                case '>=':
                    return retrieved >= value;
                case '===':
                    return retrieved === value;
                case '!==':
                    return retrieved !== value;
                case 'between':
                    return value[0] <= retrieved && retrieved <= value[1];
                case 'not_between':
                    return retrieved < value[0] || retrieved > value[1];
                case 'in':
                    return (value as any[]).includes(retrieved);
                case 'not_in':
                    return !(value as any[]).includes(retrieved);
            }
        };
    }

    static safeGet<V>(target: any[] | any, key?: string | string[], defaultValue?: V): V | undefined {
        if (typeof key == 'undefined') {
            return target;
        }
        key = Array.isArray(key) ? key : key.split('.').filter(Boolean);
        for (let segment of key) {
            if (Array.isArray(target)) {
                const intKey = parseInt(segment);
                if (isNaN(intKey)) {
                    return defaultValue;
                }
                if (intKey < target.length) {
                    target = target[intKey];
                } else {
                    return defaultValue;
                }
            } else {
                if (typeof target[segment] == 'undefined') {
                    return defaultValue;
                } else {
                    target = target[segment];
                }
            }
        }
        return Collection.value(target);
    }

    static value(val:any, ...args:any[]) {
        if(val && typeof val.call != 'undefined') {
            return val(...args);
        }
        return val;
    }
}

export const collect = <T>(items: T[] | T): Collection<T> => new Collection(items);

export const range = (start: number, end: number) => {
    const from = parseInt(Math.min(start, end) + '');
    const to = parseInt(Math.max(start, end) + '');
    const items = [];
    for (let i = from; i <= to; i++) {
        items.push(i);
    }
    return collect(items);
}
