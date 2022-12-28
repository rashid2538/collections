import {collect, range} from '../src/helpers';

const collection = range(2, 1000).map((v, k) => ({[k]: v}));

console.log(collection);
