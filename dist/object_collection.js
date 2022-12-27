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
    value(key, defaultValue) {
        const items = this.items;
        if (typeof items[key] != 'undefined') {
            return (0, helpers_1.valueOf)(items[key]);
        }
        return (0, helpers_1.valueOf)(defaultValue);
    }
}
exports.ObjectCollection = ObjectCollection;
