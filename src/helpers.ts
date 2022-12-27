import { ArrayCollection } from "./array_collection"
import { Collection } from "./collection"
import { ObjectCollection } from "./object_collection";

export const iterate = <T>(arr: T[] | any, callback: ((v: T, k: string) => void)) => {
    for(let [i, v] of arr.entries()) {
        callback(v, i)
    }
    const indexes = Object.keys(arr);
    for (let index of indexes) {
        callback(arr[index], index);
    }
};

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

export const valueOf = (val: any, ...args: any[]) => {
    if (val && typeof val.call != 'undefined') {
        return val(...args);
    }
    return val;
};

export const collect = <T>(item:T|T[]):Collection<T, T|any> => {
    if(typeof (item as any)[Symbol.iterator] == 'function') {
        return new ArrayCollection([...(item as Iterable<T>)]);
    } else if(typeof item == 'object') {
        return new ObjectCollection(item as T);
    } else if(typeof item == 'function') {
        return collect(valueOf(item));
    }
    return new ArrayCollection([item]);
};
