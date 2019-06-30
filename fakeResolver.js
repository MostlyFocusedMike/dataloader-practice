const DataLoader = require('dataloader');

const fakeBooksDB = [
    { title: 'book 1', author_id: 1, genre: 'fantasy' },
    { title: 'book 2', author_id: 2, genre: 'sci-fi' },
    { title: 'book 3', author_id: 3, genre: 'fantasy' },
    { title: 'book 4', author_id: 3, genre: 'sci-fi' },
];

const batchGetBooksByIds = async (ids) => {
    console.log('I only get run once per tick')
    const books = ids.map(authorId => {
        return fakeBooksDB.filter(book => book.author_id === authorId)
    })
    console.log('books: ', books);
    return books;
};
const userLoader = new DataLoader(batchGetBooksByIds);

// pretend we have 3 author objects, and each one wants a list of their books:
for(let i = 1; i <= 3; i++) {
    userLoader.load(i).then((res) => {
        console.log(`Author #${i} books:`);
        console.log(res);
    });
}
