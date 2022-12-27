import { collect } from "../src/collection";

describe('test collection iterator', () => {

    test('initialize with array', () => {
        expect(collect([1, 2, 3]).all()).toEqual([1, 2, 3]);
    });

    test('initialize with object', () => {
        expect(collect({
            name: 'John',
            age: 32,
        }).all()).toEqual({
            name: 'John',
            age: 32,
        });
    });

    test('can be iterated', () => {
        for (let one of collect([1])) {
            expect(one).toBe(1);
        }
    });
});

describe('sum functions', () => {
    test('with numbers array', () => {
        expect(collect([1, 2, 3]).sum()).toBe(6);
    });

    test('with object key', () => {
        expect(collect([
            { 'name': 'JavaScript: The Good Parts', 'pages': 176 },
            { 'name': 'JavaScript: The Definitive Guide', 'pages': 1096 }
        ]).sum('pages')).toBe(1272);
    });

    test('with callback', () => {
        expect(collect([
            { 'name': 'Chair', 'colors': ['Black'] },
            { 'name': 'Desk', 'colors': ['Black', 'Mahogany'] },
            { 'name': 'Bookcase', 'colors': ['Red', 'Beige', 'Brown'] },
        ]).sum((v: any) => v.colors.length)).toBe(6);
    });
});

describe('miscelenous functions', () => {
    test('chunk function', () => {
        expect(collect([1, 2, 3, 4, 5, 6, 7]).chunk(4).all()).toEqual([[1, 2, 3, 4], [5, 6, 7]]);

        const money = {
            usd: 1400,
            gbp: 1200,
            eur: 1000,
        }, rates = {
            usd: 1,
            gbp: 1.37,
            eur: 1.22,
        };

        expect(collect(money).reduce((pv, v, k?:string) => pv + (v * (rates as any)[k!]), 0)).toBe(4264);
    });

    test('chunkWhile function', () => {
        expect(collect('AABBCCCD'.split('')).chunkWhile((v, k, chunk) => v === chunk.last()).all()).toEqual([['A', 'A'], ['B', 'B'], ['C', 'C', 'C'], ['D']]);
    });

    test('collapse function', () => {
        expect(collect([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ]).collapse().all()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('combine function', () => {
        expect(collect(['name', 'age']).combine(['George', 29]).all()).toEqual({
            name: 'George',
            age: 29
        });
    });

    test('filter function', () => {
        expect(collect([1, 2, 3, 4, 5, 6, 7]).filter((v, k) => v > 2).all()).toEqual([3, 4, 5, 6, 7]);

        expect(collect([1, 2, 3, null, false, '', 0, []]).filter().all()).toEqual([1, 2, 3, []]);
    });

    test('first element', () => {
        expect(collect([1, 2, 3, 4, 5, 6, 7]).first()).toBe(1);
    });

    test('first element with callback', () => {
        expect(collect([1, 2, 3, 4]).first((v, i) => (v as number) > 2)).toBe(3);
    });

    test('keys function', () => {
        expect(collect({
            'prod-100': { 'product_id': 'prod-100', 'name': 'Desk' },
            'prod-200': { 'product_id': 'prod-200', 'name': 'Chair' },
        }).keys().all()).toEqual(['prod-100', 'prod-200']);
    });

    test('last element', () => {
        expect(collect([1, 2, 3, 4, 5, 6, 7]).last()).toBe(7);
    });

    test('last element with callback', () => {
        expect(collect([1, 2, 3, 4]).last((v, i) => v < 3)).toBe(2);
    });

    test('map function', () => {
        expect(collect([1, 2, 3, 4]).map((v, k) => v * v).all()).toEqual([1, 4, 9, 16]);
    });

    test('pluck function', () => {

        const collection = collect([
            { 'product_id': 'prod-100', 'name': 'Desk' },
            { 'product_id': 'prod-200', 'name': 'Chair' },
        ]);

        expect(collection.pluck('name')).toEqual(['Desk', 'Chair']);
        expect(collection.pluck('name', 'product_id')).toEqual({
            'prod-100': 'Desk',
            'prod-200': 'Chair',
        });
    });

    test('push function', () => {
        expect(collect([1, 2, 3, 4]).push(5).all()).toEqual([1, 2, 3, 4, 5]);
    });

    test('put function', () => {
        expect(collect({
            product_id: 1,
            name: 'Desk',
        }).put('price', 100).all()).toEqual({
            product_id: 1,
            name: 'Desk',
            price: 100
        });
    });

    test('reduce function', () => {
        expect(collect([1, 2, 3]).reduce((pv, v) => pv + v, 0)).toBe(6);
    });
});

describe('where functions', () => {

    const collection = collect([
        {'product': 'Desk', 'price': 200, 'discount': 10},
        {'product': 'Chair', 'price': 100, 'discount': 10},
        {'product': 'Bookcase', 'price': 150, 'discount': 10},
        {'product': 'Door', 'price': 100, 'discount': null},
    ]);

    test('where function', () => {
        expect(collection.where('price', 100).all()).toEqual([
            {'product': 'Chair', 'price': 100, 'discount': 10},
            {'product': 'Door', 'price': 100, 'discount': null},
        ]);
    });

    test('where function with nested key', () => {
        expect(collect([
            {'product': 'Desk', 'price': 200, 'author': {name: 'John'}},
            {'product': 'Chair', 'price': 100, 'author': {name: 'Jane'}},
            {'product': 'Bookcase', 'price': 150, 'author': {name: 'Jake'}},
        ]).where('author.name', 'Jane').all()).toEqual([
            {'product': 'Chair', 'price': 100, 'author': {name: 'Jane'}},
        ]);
    });

    test('whereBetween function', () => {
        expect(collection.whereBetween('price', [50, 150]).all()).toEqual([
            {'product': 'Chair', 'price': 100, 'discount': 10},
            {'product': 'Bookcase', 'price': 150, 'discount': 10},
            {'product': 'Door', 'price': 100, 'discount': null},
        ]);
    });

    test('whereIn function', () => {
        expect(collection.whereIn('product', ['Chair', 'Bookcase']).all()).toEqual([
            {'product': 'Chair', 'price': 100, 'discount': 10},
            {'product': 'Bookcase', 'price': 150, 'discount': 10},
        ]);
    });

    test('whereNotBetween function', () => {
        expect(collection.whereNotBetween('price', [50, 150]).all()).toEqual([
            {'product': 'Desk', 'price': 200, 'discount': 10},
        ]);
    });

    test('whereNotIn function', () => {
        expect(collection.whereNotIn('product', ['Chair', 'Bookcase']).all()).toEqual([
            {'product': 'Desk', 'price': 200, 'discount': 10},
            {'product': 'Door', 'price': 100, 'discount': null},
        ]);
    });

    test('whereNotNull function', () => {
        expect(collection.whereNotNull('discount').all()).toEqual([
            {'product': 'Desk', 'price': 200, 'discount': 10},
            {'product': 'Chair', 'price': 100, 'discount': 10},
            {'product': 'Bookcase', 'price': 150, 'discount': 10},
        ]);
    });

    test('whereNull function', () => {
        expect(collection.whereNull('discount').all()).toEqual([
            {'product': 'Door', 'price': 100, 'discount': null},
        ]);
    });
});