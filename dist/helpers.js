"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueOf = exports.toNumber = exports.safeGet = exports.iterate = exports.collect = exports.callbackForFilter = void 0;
const array_collection_1 = require("./array_collection");
const object_collection_1 = require("./object_collection");
const callbackForFilter = (key, operator, value) => {
    if (typeof key != 'string') {
        return key;
    }
    if (typeof operator == 'undefined' && typeof value == 'undefined') {
        value = true;
        operator = '=';
    }
    if (typeof value == 'undefined') {
        value = operator;
        operator = '=';
    }
    return (v, k) => {
        const retrieved = (0, exports.safeGet)(v, key);
        switch (operator) {
            case '!=':
            case '<>':
                return retrieved != value;
            case '<':
                return retrieved < value;
            case '>':
                return retrieved > value;
            case '<=':
                return retrieved <= value;
            case '>=':
                return retrieved >= value;
            case '===':
                return retrieved === value;
            case '!==':
                return retrieved !== value;
            case 'between':
                return value[0] <= retrieved && retrieved <= value[1];
            case 'not_between':
                return retrieved < value[0] || retrieved > value[1];
            case 'in':
                return value.includes(retrieved);
            case 'not_in':
                return !value.includes(retrieved);
            case '=':
            case '==':
            default:
                return retrieved == value;
        }
    };
};
exports.callbackForFilter = callbackForFilter;
const collect = (item) => {
    if (typeof item[Symbol.iterator] == 'function') {
        return new array_collection_1.ArrayCollection([...item]);
    }
    else if (typeof item == 'object') {
        return new object_collection_1.ObjectCollection(item);
    }
    else if (typeof item == 'function') {
        return (0, exports.collect)((0, exports.valueOf)(item));
    }
    return new array_collection_1.ArrayCollection([item]);
};
exports.collect = collect;
const iterate = (arr, callback) => {
    for (let [i, v] of arr.entries()) {
        callback(v, i);
    }
    const indexes = Object.keys(arr);
    for (let index of indexes) {
        callback(arr[index], index);
    }
};
exports.iterate = iterate;
const safeGet = (target, key, defaultValue) => {
    if (typeof key == 'undefined') {
        return target;
    }
    key = Array.isArray(key) ? key : key.split('.').filter(Boolean);
    for (let segment of key) {
        if (Array.isArray(target)) {
            const intKey = parseInt(segment);
            if (isNaN(intKey)) {
                return defaultValue;
            }
            if (intKey < target.length) {
                target = target[intKey];
            }
            else {
                return defaultValue;
            }
        }
        else {
            if (typeof target[segment] == 'undefined') {
                return defaultValue;
            }
            else {
                target = target[segment];
            }
        }
    }
    return (0, exports.valueOf)(target);
};
exports.safeGet = safeGet;
const toNumber = (val) => {
    return parseFloat(val + '');
};
exports.toNumber = toNumber;
const valueOf = (val, ...args) => {
    if (val && typeof val.call != 'undefined') {
        return val(...args);
    }
    return val;
};
exports.valueOf = valueOf;
