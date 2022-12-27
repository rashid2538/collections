# Javascript port of Illuminate Collections

The `Collection` class provides a fluent, convenient wrapper for working with arrays of data. For example, check out the following code. We'll use the `collect` helper to create a new collection instance from the array, run the `toUpperCase` function on each element, and then remove all empty elements:

```javascript
import { collect } from 'illuminate-collections';

const collection = collect(['taylor', 'abigail'])
    .map((name) => name.toUpperCase());

console.log(collection.all());

// ['TAYLOR', 'ABIGAIL']
```

## Available Methods

For the majority of the remaining collection documentation, we'll discuss each method available on the `Collection` class. Remember, all of these methods may be chained to fluently manipulate the underlying array. Furthermore, almost every method returns a new `Collection` instance, allowing you to preserve the original copy of the collection when necessary:


