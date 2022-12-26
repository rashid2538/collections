import { collect, range } from "../src/collection";

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

describe('test miscelenous functions', () => {
    test('chunk function', () => {
        expect(collect([1, 2, 3, 4, 5, 6, 7]).chunk(4).all()).toEqual([[1, 2, 3, 4], [5, 6, 7]]);
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

    /* test('random function', () => {
        const collection = range(1, 10);

    }); */
});