import { Collection } from "./collection";
import { collect, iterate, valueOf } from "./helpers";

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

    skip(count:number):Collection<T, any> {
        let index = 1;
        const newObj:any = {};
        this.each((v, k) => {
            if(index++ > count) {
                newObj[k] = v;
            }
        });
        return collect(newObj);
    }

    value<R>(key: string, defaultValue?: R) {
        const items = this.items as any;
        if (typeof items[key] != 'undefined') {
            return valueOf(items[key]);
        }
        return valueOf(defaultValue);
    }
}