"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectCollection = void 0;
const collection_1 = require("./collection");
const helpers_1 = require("./helpers");
class ObjectCollection extends collection_1.Collection {
    constructor(items) {
        super();
        this.items = items;
    }
    all() {
        return this.items;
    }
    count() {
        return Object.keys(this.items).length;
    }
    chunk(size) {
        const keys = this.keys().all();
        return (0, helpers_1.collect)(keys.reduce((acc, key, ind) => {
            const subIndex = Math.floor(ind / size);
            if (acc.length == subIndex) {
                acc.push({
                    [key]: this.items[key],
                });
            }
            else {
                acc[subIndex][key] = this.items[key];
            }
            return acc;
        }, []));
    }
    map(callback) {
        const newObj = {};
        this.each((v, k) => {
            newObj[k] = callback(v, k);
        });
        return (0, helpers_1.collect)(newObj);
    }
    push(...values) {
        (0, helpers_1.iterate)(values, (v, k) => {
            this.items[k] = v;
        });
        return this;
    }
    put(key, value) {
        this.items[key] = value;
        return this;
    }
    slice(offset, length) {
        let index = 0;
        const newObj = {};
        this.each((v, k) => {
            if (index >= offset) {
                if (length) {
                    if (index <= (offset + length)) {
                        newObj[k] = v;
                    }
                }
                else {
                    newObj[k] = v;
                }
            }
        });
        return (0, helpers_1.collect)(newObj);
    }
    sort(compare, descending = false) {
        const entries = this.entries();
        entries.sort((a, b) => {
            if (compare) {
                return compare(a[1], b[1]);
            }
            return (0, helpers_1.compared)(a[1], b[1], descending);
        });
        return (0, helpers_1.collect)((0, helpers_1.entriesToObject)(entries));
    }
    sortBy(key, descending = false) {
        const entries = this.entries();
        if (Array.isArray(key)) {
            entries.sort((a, b) => {
                for (let item of key) {
                    const compareResult = (0, helpers_1.compared)((0, helpers_1.safeGet)(a[1], item[0]), (0, helpers_1.safeGet)(b[1], item[0]), item[1] === 'desc');
                    if (compareResult != 0) {
                        return compareResult;
                    }
                }
                return 0;
            });
        }
        else {
            entries.sort((a, b) => {
                return typeof key == 'string' ?
                    (0, helpers_1.compared)((0, helpers_1.safeGet)(a[1], key), (0, helpers_1.safeGet)(b[1], key), descending) :
                    (descending ?
                        key(b[1]) - key(a[1]) :
                        key(a[1]) - key(b[1]));
            });
        }
        return (0, helpers_1.collect)((0, helpers_1.entriesToObject)(entries));
    }
}
exports.ObjectCollection = ObjectCollection;
