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
    value(key, defaultValue) {
        const intKey = parseInt(key);
        if (intKey < this.length) {
            return (0, helpers_1.valueOf)(this.items[intKey]);
        }
        return (0, helpers_1.valueOf)(defaultValue);
    }
}
exports.ArrayCollection = ArrayCollection;
