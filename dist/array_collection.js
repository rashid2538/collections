"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayCollection = void 0;
const collection_1 = require("./collection");
const helpers_1 = require("./helpers");
class ArrayCollection extends collection_1.Collection {
    constructor(items) {
        super();
        this.items = items;
    }
    all() {
        return this.items;
    }
    chunk(size) {
        return (0, helpers_1.collect)(this.items.reduce((acc, val, ind) => {
            const subIndex = Math.floor(ind / size);
            if (acc.length == subIndex) {
                acc.push([val]);
            }
            else {
                acc[subIndex].push(val);
            }
            return acc;
        }, []));
    }
    count() {
        return this.items.length;
    }
    map(callback) {
        return (0, helpers_1.collect)(this.entries().map((vv) => callback(vv[1], vv[0])));
    }
    push(...values) {
        this.items.push(...values);
        return this;
    }
    put(key, value) {
        const intKey = parseInt(key);
        if (intKey < this.length) {
            this.items[intKey] = value;
        }
        else {
            this.items.push(value);
        }
        return this;
    }
    slice(offset, length) {
        return (0, helpers_1.collect)(this.items.slice(offset, length ? length + offset : undefined));
    }
    sort(compare, descending) {
        return (0, helpers_1.collect)([...this.items].sort(compare ? compare : (a, b) => (0, helpers_1.compared)(a, b, descending !== null && descending !== void 0 ? descending : false)));
    }
    sortBy(key, descending) {
        if (typeof key == 'string') {
            return this.sort((a, b) => {
                return (0, helpers_1.compared)((0, helpers_1.safeGet)(a, key), (0, helpers_1.safeGet)(b, key), descending);
            });
        }
        else if (Array.isArray(key)) {
            return this.sort((a, b) => {
                for (let item of key) {
                    const compareResult = (0, helpers_1.compared)((0, helpers_1.safeGet)(a, item[0]), (0, helpers_1.safeGet)(b, item[0]), item[1] === 'desc');
                    if (compareResult != 0) {
                        return compareResult;
                    }
                }
                return 0;
            });
        }
        else {
            return (0, helpers_1.collect)([...this.items].sort((a, b) => {
                return descending ? key(b) - key(a) : key(a) - key(b);
            }));
        }
    }
}
exports.ArrayCollection = ArrayCollection;
