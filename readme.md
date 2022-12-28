# Javascript port of Illuminate Collections

[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-downloads-url] [![MIT License][license-image]][license-url]

The `Collection` class provides a fluent, convenient wrapper for working with arrays of data. For example, check out the following code. We'll use the `collect` helper to create a new collection instance from the array, run the `toUpperCase` function on each element, and then remove all empty elements:

```javascript
import { collect } from  'illuminate-collections';

const  collection = collect(['taylor', 'abigail'])
	.map((name) =>  name.toUpperCase());
	
console.log(collection.all());

// ['TAYLOR', 'ABIGAIL']
```

## Installation

```bash
npm install illuminate-collections
```

## License

This project is freely distributable under the terms of the [MIT license][license-url].

## Creating Collections

As mentioned above, the `collect` helper returns a new `Collection` instance for the given array or object. So, creating a collection is as simple as:

```javascript
import { collect } from  'illuminate-collections';

const  collection = collect([1, 2, 3]);
```

## Available Methods

For the majority of the remaining collection documentation, we'll discuss each method available on the `Collection` class. Remember, all of these methods may be chained to fluently manipulate the underlying array. Furthermore, almost every method returns a new `Collection` instance, allowing you to preserve the original copy of the collection when necessary:

|  |  |  |
| ----------------------- | ------------------------- | --------------------- |
|[all](#all)                     | [chunk](#chunk) | [collect](#collect) |
|[average](#average) | [chunkWhile](#chunkWhile) | [combine](#combine) |
|[avg](#avg) | [collapse](#collapse) | [contains](#contains) |

### `all()`

Returns the underlying array/object represented by the collection:

```javascript
collect([1, 2, 3]).all();

// [1, 2, 3]
```

### `average()`

Alias for the `avg` method.

#### `avg()`

Returns the  [average value](https://en.wikipedia.org/wiki/Average)  of a given key:

```javascript
const average  =  collect([
	{'foo':  10},
	{'foo':  10},
	{'foo':  20},
	{'foo':  40},
]).avg('foo');

console.log(average);
// average = 20

const average  =  collect([1,  1,  2,  4]).avg();

console.log(average);
// average = 2
```

#### `chunk()`

Breaks the collection into multiple, smaller collections of a given size:

```javascript
const  collection = collect([1, 2, 3, 4, 5, 6, 7]);

const  chunks = collection.chunk(4);

console.log(chunks.all());
// [[1, 2, 3, 4], [5, 6, 7]]
```

#### `chunkWhile()`

Breaks the collection into multiple, smaller collections based on the evaluation of the given callback. The  `chunk`  variable passed to the closure may be used to inspect the previous element:

```javascript
const  collection = collect('AABBCCCD');

const  chunks = collection.chunkWhile((value, key, chunk) => value === chunk.last());

console.log(chunks.all());
// [['A', 'A'], ['B', 'B'], ['C', 'C', 'C'], ['D']]
```

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[npm-url]: https://npmjs.org/package/illuminate-collections
[npm-version-image]: https://img.shields.io/npm/v/illuminate-collections.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/illuminate-collections.svg?style=flat
[npm-downloads-url]: https://npmcharts.com/compare/illuminate-collections?minimal=true