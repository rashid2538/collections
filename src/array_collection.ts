import { Collection } from "./collection";
import { collect, compared, safeGet, valueOf } from "./helpers";

export class ArrayCollection<T> extends Collection<T, T> {

    private items: T[];

    constructor(items: T[]) {
        super();
        this.items = items;
    }

    all() {
        return this.items;
    }

    chunk(size: number): Collection<T[], T[]> {
        return collect(this.items.reduce((acc: T[][], val: T, ind: number) => {
            const subIndex = Math.floor(ind / size);
            if (acc.length == subIndex) {
                acc.push([val]);
            } else {
                acc[subIndex].push(val);
            }
            return acc;
        }, []));
    }

    count(): number {
        return this.items.length;
    }

    map<R>(callback: ((value: T, key: string) => R)): Collection<R, R> {
        return collect(this.entries().map((vv) => callback(vv[1], vv[0])));
    }

    push(...values: T[]) {
        this.items.push(...values);
        return this;
    }

    put(key: string, value: T) {
        const intKey = parseInt(key);
        if (intKey < this.length) {
            this.items[intKey] = value;
        } else {
            this.items.push(value);
        }
        return this;
    }

    slice(offset: number, length?: number) {
        return collect(this.items.slice(offset, length ? length + offset : undefined));
    }

    sort(compare?: (a: T, b: T) => number, descending?: boolean): Collection<T, T> {
        return collect([...this.items].sort(compare ? compare : (a, b) => compared(a, b, descending ?? false)));
    }

    sortBy(key: string | ((item: T) => number) | [string, undefined | 'asc' | 'desc'][], descending?: boolean) {
        if (typeof key == 'string') {
            return this.sort((a: T, b: T) => {
                return compared(safeGet(a, key), safeGet(b, key), descending);
            });
        } else if(Array.isArray(key)) {
            return this.sort((a: T, b: T) => {
                for(let item of key) {
                    const compareResult = compared(safeGet(a, item[0]), safeGet(b, item[0]), item[1] === 'desc');
                    if(compareResult != 0) {
                        return compareResult;
                    }
                }
                return 0;
            });
        } else {
            return collect([...this.items].sort((a, b) => {
                return descending ? key(b) - key(a) : key(a) - key(b);
            }))
        }
    }
}
