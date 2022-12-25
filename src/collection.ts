export class Collection<T> implements Iterable<T>, Iterator<T> {

    private currentIndex: number = 0;
    private items: Map<string, T> = new Map();
    private isArray = true;

    constructor(items: T[] | any) {
        if (Array.isArray(items)) {
            for (let index = 0; index < items.length; index++) {
                this.items.set(index + '', items[index]);
            }
        } else {
            this.isArray = false;
            const keys = Object.keys(items);
            for (let key of keys) {
                this.items.set(key, items[key]);
            }
        }
    }

    get length() {
        return this.items.size;
    }

    [Symbol.iterator](): Iterator<T, any, undefined> {
        return this;
    }

    next(...args: [] | [undefined]): IteratorResult<T, any> {
        if (this.currentIndex < this.length) {
            return {
                value: this.items.get(this.keys().get('' + this.currentIndex++)!)!,
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
    all(): T[] | any {
        return this.isArray ? [...this.items.values()] : Object.fromEntries(this.items);
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

    chunk(size: number): Collection<Collection<T>> {
        return Collection.collect([...this.items.values()].reduce((acc: T[][], val: T, index: number) => {
            const subIndex = Math.floor(index / size);
            if (acc.length == subIndex) {
                acc.push([val]);
            } else {
                acc[subIndex].push(val);
            };
            return acc;
        }, []));
    }

    /* chunkWhile(callback: ((value: T, index: string, chunk: T[]) => boolean)) {
        const chunks: T[][] = [Collection.collect<T>([])];
        for (let index = 0; index < this.items.length; index++) {
            if (callback())
        }
    } */

    each(callback: ((value: T, key: string) => boolean | void)) {
        for (let item of this.items) {
            const result = callback(item[1], item[0]);
            if (result === false) {
                break;
            }
        }
    }

    first(callback?: ((value: T, index: number) => boolean)): T | null {
        if (callback === undefined) {
            const values = [...this.items.values()];
            return this.length > 0 ? values[0] : null;
        } else {
            const keys = this.keys();
            for (let keyIndex = 0; keyIndex < this.length; keyIndex++) {
                const key = keys.get<string>(keyIndex + '')!;
                const value = this.items.get(key)!;
                if (callback(value, keyIndex)) {
                    return value;
                }
            }
        }
        return null;
    }

    get<V>(key: string, defaultValue?: V): V | undefined {
        if (this.items.has(key)) {
            return this.items.get(key) as V;
        }
        return defaultValue;
    }

    keys(): Collection<string> {
        return Collection.collect([...this.items.keys()]);
    }

    last(callback?: ((value: T, index: number) => boolean)): T | null {
        if (callback === undefined) {
            const values = [...this.items.values()];
            return this.length > 0 ? values[values.length - 1] : null;
        } else {
            const keys = this.keys();
            for (let keyIndex = this.length - 1; keyIndex > -1; keyIndex--) {
                const key = keys.get<string>(keyIndex + '')!;
                const value = this.items.get(key)!;
                if (callback(value, keyIndex)) {
                    return value;
                }
            }
        }
        return null;
    }

    map<V>(callback: ((value: T, key: string) => V)) {
        if(this.isArray) {
            return Collection.collect<V>(this.values().all().map(callback));
        } else {
            const newObj:any = {};
            this.each((v, k) => {
                newObj[k] = callback(v, k);
            });
            return Collection.collect<V>(newObj);
        }
    }

    reduce<V>(callback: ((previousValue: V, currentValue: T) => V), initialValue: V) {
        this.values().each((v, k) => {
            initialValue = callback(initialValue, v);
        });
        return initialValue;
    }

    sum(key?: string | ((item: T) => number)): number {
        if (key === undefined || typeof key === 'string') {
            return this.reduce((pv: number, cv: any) => pv + (key === undefined ? (cv as number) : (cv[key] as number)), 0) as number;
        } else {
            return this.values().map(key).reduce((pv: number, cv: number) => pv + cv, 0);
        }
    }

    values(): Collection<T> {
        return Collection.collect([...this.items.values()]);
    }

    static collect<R>(items: R[] | any): Collection<R> {
        return new Collection(items);
    }
}