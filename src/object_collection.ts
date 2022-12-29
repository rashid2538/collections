import { Collection } from "./collection";
import { collect, compared, entriesToObject, iterate, safeGet, valueOf } from "./helpers";

export class ObjectCollection<T> extends Collection<T, any> {

    private items: T;

    constructor(items: T) {
        super();
        this.items = items;
    }

    all() {
        return this.items;
    }

    count(): number {
        return Object.keys(this.items as any).length;
    }

    chunk(size: number): Collection<any[], any[]> {
        const keys = this.keys().all() as string[];
        return collect(keys.reduce((acc: any[], key: string, ind: number) => {
            const subIndex = Math.floor(ind / size);
            if (acc.length == subIndex) {
                acc.push({
                    [key]: (this.items as any)[key],
                });
            } else {
                acc[subIndex][key] = (this.items as any)[key];
            }
            return acc;
        }, [] as any[]));
    }

    map<R>(callback: ((value: T, key: string) => R)): Collection<R, R> {
        const newObj: any = {};
        this.each((v, k) => {
            newObj[k] = callback(v, k);
        });
        return collect(newObj);
    }

    push(...values: any) {
        iterate(values, (v, k) => {
            (this.items as any)[k] = v;
        });
        return this;
    }

    put(key: string, value: any) {
        (this.items as any)[key] = value;
        return this;
    }

    slice(offset: number, length?: number) {
        let index = 0;
        const newObj: any = {};
        this.each((v, k) => {
            if (index >= offset) {
                if (length) {
                    if (index <= (offset + length)) {
                        newObj[k] = v;
                    }
                } else {
                    newObj[k] = v;
                }
            }
        });
        return collect(newObj);
    }

    sort(compare?: (a: any, b: any) => number, descending: boolean = false): Collection<T, any> {
        const entries = this.entries();
        entries.sort((a, b) => {
            if (compare) {
                return compare(a[1], b[1]);
            }
            return compared(a[1], b[1], descending);
        });
        return collect(entriesToObject(entries));
    }

    sortBy(key: string | ((item: any) => number) | [string, undefined | 'asc' | 'desc'][], descending: boolean = false) {
        const entries = this.entries();
        if(Array.isArray(key)) {
            entries.sort((a, b) => {
                for(let item of key) {
                    const compareResult = compared(safeGet(a[1], item[0]), safeGet(b[1], item[0]), item[1] === 'desc');
                    if(compareResult != 0) {
                        return compareResult;
                    }
                }
                return 0;
            });
        } else {
            entries.sort((a, b) => {
                return typeof key == 'string' ?
                    compared(safeGet(a[1], key), safeGet(b[1], key), descending) :
                    (descending ?
                        key(b[1]) - key(a[1]) :
                        key(a[1]) - key(b[1]));
            });
        }
        return collect(entriesToObject(entries));
    }
}
