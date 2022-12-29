import { ArrayCollection } from "./array_collection"
import { Collection } from "./collection"
import { ObjectCollection } from "./object_collection";

/**
 * Creates a callback for the filter function depending upon the arguments.
 * @param key Key to look for the filter.
 * @param operator Operator to be used during filteration.
 * @param value Value against which the comparison will take place. If omitted then operator will be `=` and value will be used from previous argument.
 * @returns `(value: T, key: string) => boolean`
 */
export const callbackForFilter = <T>(key: string | ((value: T, key: string) => boolean), operator?: any, value?: any): ((value: T, key: string) => boolean) => {
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

    return (v: any, k: string) => {
        const retrieved: any = safeGet(v, key);
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
                return (value as any[]).includes(retrieved);
            case 'not_in':
                return !(value as any[]).includes(retrieved);
            case '=':
            case '==':
            default:
                return retrieved == value;
        }
    };
};

/**
 * Create a new collection based on the iterable, array or object passed.
 * @param item An array or object to be collected.
 * @returns `Collection<T, T | any>
 */
export const collect = <T>(item: T[] | T): Collection<T, T | any> => {
    if(Array.isArray(item)) {
        return new ArrayCollection(item);
    } else if (typeof item == 'object') {
        return new ObjectCollection(item as T);
    } else if (typeof (item as any)[Symbol.iterator] == 'function') {
        return new ArrayCollection([...(item as Iterable<T>)]);
    } else if (typeof item == 'function') {
        return collect(valueOf(item));
    }
    return new ArrayCollection([item]);
};

export const compared = <T>(a:T, b:T, reversed:boolean = false):number => {
    const strA:string = (a as any).toString();
    const strB:string = (b as any).toString();
    const numberA = parseFloat(strA);
    const numberB = parseFloat(strB);
    if(!isNaN(numberA) && !isNaN(numberB)) {
        return reversed ? numberB - numberA : numberA - numberB;
    } else {
        return reversed ? strB.localeCompare(strA) : strA.localeCompare(strB);
    }
};

/**
 * Creates an array from the entries array.
 * @param entries Entries array to be converted into array.
 * @returns `T[]`
 */
export const entriesToArray = <T>(entries:[string, T][]): T[] => {
    return entries.map(e => e[1]);
};

/**
 * Creates an object from the entries array.
 * @param entries Entries object to be converted into object.
 * @returns any
 */
export const entriesToObject = (entries:[string, any][]): any => {
    const result:any = {};
    for(let entry of entries) {
        result[entry[0]] = entry[1];
    }
    return result;
};

/**
 * Creates a callback for the equality check for a value.
 * @param value Value to be checked for equality.
 * @returns `(item: T) => boolean`
 */
export const equality = <T>(value:T) => (item:T) => item === value;

/**
 * Iterates an array via a callback.
 * @param arr Array to iterate.
 * @param callback Callback to be used for the iteration.
 */
export const iterate = <T>(arr: T[] | any, callback: ((v: T, k: string) => void)): void => {
    for (let [i, v] of arr.entries()) {
        callback(v, i)
    }
    const indexes = Object.keys(arr);
    for (let index of indexes) {
        callback(arr[index], index);
    }
};

/**
 * Creates a negating callback for the callback passed.
 * @param callback Callback to be negated.
 * @returns (...params: any[]) => boolean
 */
export const negate = (callback:(...args:any[]) => boolean) => (...params:any[]) => !callback(...params);

/**
 * Creates a collection with integers from `start` to `end`.
 * @param start Number to start from.
 * @param end Number to end at.
 * @returns Collection<number, number>
 */
export const range = (start: number, end: number):Collection<number, number> => {
    const from = Math.round(Math.min(start, end));
    const to = Math.round(Math.max(start, end));
    const items = [];
    for (let i = from; i <= to; i++) {
        items.push(i);
    }
    return collect(items);
}

/**
 * Returns the value from the array or object based on the key.
 * @param target Value to be retrieved from.
 * @param key Key to look up in the target.
 * @param defaultValue Default value in case key was not found.
 * @returns any
 */
export const safeGet = <V>(target: any[] | any, key?: string | string[], defaultValue?: V): V | undefined => {
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
            } else {
                return defaultValue;
            }
        } else {
            if (typeof target[segment] == 'undefined') {
                return defaultValue;
            } else {
                target = target[segment];
            }
        }
    }
    return valueOf(target);
};

/**
 * Converts the passed value to a number (can return a NaN).
 * @param val Value to convert to a number.
 * @returns number
 */
export const toNumber = (val: any): number => {
    return parseFloat(val + '');
};

/**
 * Parses the value of the item passed.
 * @param val Value to be evaluated.
 * @param args Arguments to be passed to the callback.
 * @returns any
 */
export const valueOf = (val: any, ...args: any[]): any => {
    if (val && typeof val.call != 'undefined') {
        return val(...args);
    }
    return val;
};
