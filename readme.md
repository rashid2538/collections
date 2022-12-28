# Javascript port of Illuminate Collections

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-downloads-url]
[![MIT License][license-image]][license-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![FOSSA Status][fossa-badge-image]][fossa-badge-url]

The `Collection` class provides a fluent, convenient wrapper for working with arrays of data. For example, check out the following code. We'll use the `collect` helper to create a new collection instance from the array, run the `toUpperCase` function on each element, and then remove all empty elements:

```javascript
import { collect } from 'illuminate-collections';

const collection = collect(['taylor', 'abigail'])
    .map((name) => name.toUpperCase());

console.log(collection.all());

// ['TAYLOR', 'ABIGAIL']
```

## Installation



```bash
npm install illuminate-collections
```

## License

This project is freely distributable under the terms of the [MIT license][license-url].

## Available Methods

For the majority of the remaining collection documentation, we'll discuss each method available on the `Collection` class. Remember, all of these methods may be chained to fluently manipulate the underlying array. Furthermore, almost every method returns a new `Collection` instance, allowing you to preserve the original copy of the collection when necessary:

