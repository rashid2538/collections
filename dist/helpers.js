"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueOf = exports.toNumber = exports.safeGet = exports.range = exports.negate = exports.iterate = exports.equality = exports.entriesToObject = exports.entriesToArray = exports.compared = exports.collect = exports.callbackForFilter = void 0;
const array_collection_1 = require("./array_collection");
const object_collection_1 = require("./object_collection");
/**
 * Creates a callback for the filter function depending upon the arguments.
 * @param key Key to look for the filter.
 * @param operator Operator to be used during filteration.
 * @param value Value against which the comparison will take place. If omitted then operator will be `=` and value will be used from previous argument.
 * @returns `(value: T, key: string) => boolean`
 */
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
/**
 * Create a new collection based on the iterable, array or object passed.
 * @param item An array or object to be collected.
 * @returns `Collection<T, T | any>
 */
const collect = (item) => {
    if (Array.isArray(item)) {
        return new array_collection_1.ArrayCollection(item);
    }
    else if (typeof item == 'object') {
        return new object_collection_1.ObjectCollection(item);
    }
    else if (typeof item[Symbol.iterator] == 'function') {
        return new array_collection_1.ArrayCollection([...item]);
    }
    else if (typeof item == 'function') {
        return (0, exports.collect)((0, exports.valueOf)(item));
    }
    return new array_collection_1.ArrayCollection([item]);
};
exports.collect = collect;
const compared = (a, b, reversed = false) => {
    const strA = a.toString();
    const strB = b.toString();
    const numberA = parseFloat(strA);
    const numberB = parseFloat(strB);
    if (!isNaN(numberA) && !isNaN(numberB)) {
        return reversed ? numberB - numberA : numberA - numberB;
    }
    else {
        return reversed ? strB.localeCompare(strA) : strA.localeCompare(strB);
    }
};
exports.compared = compared;
/**
 * Creates an array from the entries array.
 * @param entries Entries array to be converted into array.
 * @returns `T[]`
 */
const entriesToArray = (entries) => {
    return entries.map(e => e[1]);
};
exports.entriesToArray = entriesToArray;
/**
 * Creates an object from the entries array.
 * @param entries Entries object to be converted into object.
 * @returns any
 */
const entriesToObject = (entries) => {
    const result = {};
    for (let entry of entries) {
        result[entry[0]] = entry[1];
    }
    return result;
};
exports.entriesToObject = entriesToObject;
/**
 * Creates a callback for the equality check for a value.
 * @param value Value to be checked for equality.
 * @returns `(item: T) => boolean`
 */
const equality = (value) => (item) => item === value;
exports.equality = equality;
/**
 * Iterates an array via a callback.
 * @param arr Array to iterate.
 * @param callback Callback to be used for the iteration.
 */
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
/**
 * Creates a negating callback for the callback passed.
 * @param callback Callback to be negated.
 * @returns (...params: any[]) => boolean
 */
const negate = (callback) => (...params) => !callback(...params);
exports.negate = negate;
/**
 * Creates a collection with integers from `start` to `end`.
 * @param start Number to start from.
 * @param end Number to end at.
 * @returns Collection<number, number>
 */
const range = (start, end) => {
    const from = Math.round(Math.min(start, end));
    const to = Math.round(Math.max(start, end));
    const items = [];
    for (let i = from; i <= to; i++) {
        items.push(i);
    }
    return (0, exports.collect)(items);
};
exports.range = range;
/**
 * Returns the value from the array or object based on the key.
 * @param target Value to be retrieved from.
 * @param key Key to look up in the target.
 * @param defaultValue Default value in case key was not found.
 * @returns any
 */
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
/**
 * Converts the passed value to a number (can return a NaN).
 * @param val Value to convert to a number.
 * @returns number
 */
const toNumber = (val) => {
    return parseFloat(val + '');
};
exports.toNumber = toNumber;
/**
 * Parses the value of the item passed.
 * @param val Value to be evaluated.
 * @param args Arguments to be passed to the callback.
 * @returns any
 */
const valueOf = (val, ...args) => {
    if (val && typeof val.call != 'undefined') {
        return val(...args);
    }
    return val;
};
exports.valueOf = valueOf;
