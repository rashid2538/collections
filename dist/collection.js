"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const helpers_1 = require("./helpers");
class Collection {
    get length() {
        return this.count();
    }
    [Symbol.iterator]() {
        let index = 0;
        const items = this.values().all();
        return {
            next() {
                return index < items.length ? {
                    done: index > items.length,
                    value: items[index++],
                } : { done: true, value: null };
            }
        };
    }
    average(key) {
        return this.avg(key);
    }
    avg(key) {
        return this.sum(key) / this.length;
    }
    chunkWhile(callback) {
        const chunks = [];
        this.each((v, k) => {
            if (callback(v, k, (0, helpers_1.collect)(chunks.length > 0 ? chunks[chunks.length - 1] : []))) {
                chunks[chunks.length - 1].push(v);
            }
            else {
                chunks.push([v]);
            }
        });
        return (0, helpers_1.collect)(chunks);
    }
    collapse() {
        return (0, helpers_1.collect)(this.all().flat());
    }
    collect() {
        return (0, helpers_1.collect)(this.all());
    }
    combine(items) {
        const newObject = {};
        this.each((v, k) => {
            newObject[v] = typeof items[parseInt(k)] == 'undefined' ? null : items[parseInt(k)];
        });
        return (0, helpers_1.collect)(newObject);
    }
    contains(valueOrCallback) {
        if (typeof valueOrCallback == 'function') {
            let result = false;
            this.each((v, k) => {
                if (valueOrCallback(v, k)) {
                    result = true;
                    return false;
                }
            });
            return result;
        }
        else {
            return this.values().all().includes(valueOrCallback);
        }
    }
    containsOneItem() {
        return this.length == 1;
    }
    each(callback) {
        for (let [i, v] of this.entries()) {
            const result = callback(v, i);
            if (result === false) {
                break;
            }
        }
    }
    entries() {
        return Object.entries(this.all());
    }
    filter(callback) {
        callback = callback !== null && callback !== void 0 ? callback : Boolean;
        const result = [];
        this.each((v, k) => {
            if (callback(v, k)) {
                result.push(v);
            }
        });
        return (0, helpers_1.collect)(result);
    }
    first(callback) {
        if (callback === undefined) {
            const entries = this.entries();
            if (entries.length > 0) {
                return entries[0][1];
            }
            return null;
        }
        else {
            let result = null;
            this.each((v, k) => {
                if (callback(v, k)) {
                    result = v;
                    return false;
                }
            });
            return result;
        }
    }
    get(key, defaultValue) {
        const filtered = this.entries().filter(v => v[0] == key);
        if (filtered.length > 0) {
            return filtered[0][1];
        }
        return (0, helpers_1.valueOf)(defaultValue);
    }
    keyBy(key) {
        const newObject = {};
        if (typeof key == 'string') {
            this.each((v, k) => {
                if (typeof v[key] != 'undefined') {
                    newObject[v[key]] = v;
                }
            });
        }
        else {
            this.each((v, k) => {
                const strKey = key(v, k);
                if (typeof strKey == 'string') {
                    newObject[strKey] = v;
                }
            });
        }
        return (0, helpers_1.collect)(newObject);
    }
    keys() {
        return (0, helpers_1.collect)(this.entries().map((v) => v[0]));
    }
    last(callback) {
        const entries = this.entries();
        if (callback === undefined) {
            if (entries.length > 0) {
                return entries[entries.length - 1][1];
            }
            return null;
        }
        else {
            let result = null;
            for (let i = entries.length - 1; i >= 0; i--) {
                if (callback(entries[i][1], entries[i][0])) {
                    result = entries[i][1];
                    break;
                }
            }
            return result;
        }
    }
    max() {
        return Math.min(...this.values().all().map(parseFloat).filter((v) => !isNaN(v)));
    }
    pluck(valueField, keyField) {
        const result = typeof keyField == 'undefined' ? [] : {};
        this.each((v, k) => {
            const record = (0, helpers_1.collect)(v);
            if (Array.isArray(result)) {
                result.push(record.get(valueField));
            }
            else {
                result[record.get(keyField)] = record.get(valueField);
            }
        });
        return (0, helpers_1.collect)(result);
    }
    random() {
        const entries = this.entries();
        const randomEntry = entries[Math.floor(Math.random() * entries.length)];
        return randomEntry[1];
    }
    reduce(callback, initialValue) {
        this.each((v, k) => {
            initialValue = callback(initialValue, v, k);
        });
        return initialValue;
    }
    sum(key) {
        if (key === undefined || typeof key === 'string') {
            return this.reduce((pv, cv) => pv + (0, helpers_1.toNumber)(key === undefined ? cv : cv[key]), 0);
        }
        else {
            return this.values().map(key).reduce((pv, cv) => pv + cv, 0);
        }
    }
    values() {
        return (0, helpers_1.collect)(this.entries().map((v) => v[1]));
    }
    where(key, operator, value) {
        return this.filter((0, helpers_1.callbackForFilter)(key, operator, value));
    }
    whereBetween(key, range) {
        return this.where(key, 'between', range);
    }
    whereIn(key, items) {
        return this.where(key, 'in', items);
    }
    whereNotBetween(key, range) {
        return this.where(key, 'not_between', range);
    }
    whereNotIn(key, items) {
        return this.where(key, 'not_in', items);
    }
    whereNotNull(key) {
        return this.where(key, '!==', null);
    }
    whereNull(key) {
        return this.where(key, '===', null);
    }
}
exports.Collection = Collection;
