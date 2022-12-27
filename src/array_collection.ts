import { Collection } from "./collection";
import { collect, valueOf } from "./helpers";

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

    value<R>(key: string, defaultValue?: R) {
        const intKey = parseInt(key);
        if (intKey < this.length) {
            return valueOf(this.items[intKey]);
        }
        return valueOf(defaultValue);
    }
}