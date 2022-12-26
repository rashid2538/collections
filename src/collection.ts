type CollectionItemType<T> = any | T[];

export class Collection<T> implements Iterable<any>, Iterator<any> {

    private currentIndex: number = 0;
    protected items: CollectionItemType<T>;
    private isArray = true;

    constructor(items: T[] | any) {
        this.isArray = Array.isArray(items);
        this.items = items;
    }

    private get itemsAsArray():T[] {
        return this.items as T[];
    }

    private get itemsAsObject():any {
        return this.items as any;
    }

    get length():number {
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
        if(this.isArray) {


            return collect(this.itemsAsArray.reduce((acc:T[][], val:T, ind:number) => {
                const subIndex = Math.floor(ind / size);
                if(acc.length == subIndex) {
                    acc.push([val]);
                 } else {
                    acc[subIndex].push(val);
                 }
                 return acc;
            }, []));
        } else {
            const keys = this.keys().all() as string[];
            return collect(keys.reduce((acc:any[], key:string, ind:number) => {
                const subIndex = Math.floor(ind / size);
                if(acc.length == subIndex) {
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
            this.each((v:any, k) => {
                if ((valueOrCallback as ((v: any, k: string) => boolean))(v, k)) {
                    result = true;
                    return false;
                }
            });
            return result;
        }
    }

    each(callback: ((value: any, key: string) => boolean | void)) {
        if(this.isArray) {
            for(let i = 0; i < this.length; i++) {
                const result = callback(this.itemsAsArray[i], i + '');
                if (result === false) {
                    break;
                }
            }
        } else {
            for (let key of this.itemsAsObject) {
                const result = callback(this.itemsAsObject[key], key);
                if (result === false) {
                    break;
                }
            }
        }
    }

    first(callback?: ((value: any, index: number) => boolean)): any | null {
        if (callback === undefined) {
            if(this.isArray) {
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
        if(this.isArray) {
            const intKey = parseInt(key);
            if(intKey < this.length) {
                return this.itemsAsArray[intKey];
            }
        } else {
            if(typeof this.itemsAsObject[key] != 'undefined') {
                return this.itemsAsObject[key];
            }
        }
        return defaultValue;
    }

    keys(): Collection<string> {
        return collect(Object.keys(this.items));
    }

    last(callback?: ((value: any, key: string) => boolean)): any | null {
        if (callback === undefined) {
            if(this.isArray) {
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

    map<V>(callback: ((value: T, key: string) => V)):Collection<V> {
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
        if(this.isArray) {
            const intKey = parseInt(key);
            if(intKey < this.length) {
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

    reduce<V>(callback: ((previousValue: V, currentValue: any) => V), initialValue: V) {
        this.values().each((v:T, k:string) => {
            initialValue = callback(initialValue, v);
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

    values(): Collection<T> {
        return collect(this.isArray ? this.itemsAsArray : Object.values(this.itemsAsObject));
    }

    private static iterate<T>(arr: T[] | any, callback: ((v: T, k: string) => void)) {
        const indexes = Object.keys(arr);
        for (let index of indexes) {
            callback(arr[index], index);
        }
    }
}

export const collect = <T>(items: T[] | T):Collection<T> => new Collection(items);

export const range = (start: number, end: number) => {
    const from = parseInt(Math.min(start, end) + '');
    const to = parseInt(Math.max(start, end) + '');
    const items = [];
    for (let i = from; i <= to; i++) {
        items.push(i);
    }
    return collect(items);
}
