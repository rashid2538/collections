import { Collection } from "../src/collection";

describe('test collection iterator', () => {

    test('iterator is generated', () => {
        expect(Collection.collect([1, 2, 3]).next().value).toBe(1);
    });

    test('can be iterated', () => {
        for (let one of Collection.collect([1])) {
            expect(one).toBe(1);
        }
    });
});

describe('sum functions', () => {
    test('with numbers', () => {
        expect(Collection.collect([1, 2, 3]).sum()).toBe(6);
    });

    test('with object key', () => {
        expect(Collection.collect([
            { 'name': 'JavaScript: The Good Parts', 'pages': 176 },
            { 'name': 'JavaScript: The Definitive Guide', 'pages': 1096 }
        ]).sum('pages')).toBe(1272);
    });

    test('with callback', () => {
        expect(Collection.collect([
            { 'name': 'Chair', 'colors': ['Black'] },
            { 'name': 'Desk', 'colors': ['Black', 'Mahogany'] },
            { 'name': 'Bookcase', 'colors': ['Red', 'Beige', 'Brown'] },
        ]).sum((v:any) => v.colors.length)).toBe(6);
    });
});

describe('test miscelenous functions', () => {
    test('chunk function', () => {
        expect(Collection.collect([1, 2, 3, 4, 5, 6, 7]).chunk(4).all()).toEqual([[1, 2, 3, 4], [5, 6, 7]]);
    });

    test('first element', () => {
        expect(Collection.collect([1, 2, 3, 4, 5, 6, 7]).first()).toBe(1);
    });

    test('first element with callback', () => {
        expect(Collection.collect<number>([1, 2, 3, 4]).first((v:number, i) => v > 2)).toBe(3);
    });

    test('keys function', () => {
        console.log(Collection.collect({
            'prod-100': {'product_id': 'prod-100', 'name': 'Desk'},
            'prod-200': {'product_id': 'prod-200', 'name': 'Chair'},
        }).keys().all());
        expect(Collection.collect({
            'prod-100': {'product_id': 'prod-100', 'name': 'Desk'},
            'prod-200': {'product_id': 'prod-200', 'name': 'Chair'},
        }).keys().all()).toEqual(['prod-100', 'prod-200']);
    });

    test('last element', () => {
        expect(Collection.collect<number>([1, 2, 3, 4, 5, 6, 7]).last()).toBe(7);
    });

    test('last element with callback', () => {
        expect(Collection.collect<number>([1, 2, 3, 4]).last((v, i) => v < 3)).toBe(2);
    });
});