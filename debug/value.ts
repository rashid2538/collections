import { collect } from "../src/collection";

const collection = collect({
    date: () => new Date(),
});

setInterval(() => console.log(collection.get('date')), 1000);