const DataLoader = require('dataloader');

const fakeBooksDB = [
    { title: 'book 1', author_id: 1, genre: 'fantasy' },
    { title: 'book 2', author_id: 2, genre: 'sci-fi' },
    { title: 'book 3', author_id: 3, genre: 'fantasy' },
    { title: 'book 4', author_id: 3, genre: 'sci-fi' },
];

const batchGetBooksByIds = (ids) => {
    const books = ids.map(authorId => {
        return fakeBooksDB.filter(book => book.author_id === authorId)
    })
    console.log('I only get run once per tick')
    return Promise.resolve(books);
};
const userLoader = new DataLoader(batchGetBooksByIds);

// pretend we have 3 author objects, and each one wants a list of their books:
for(let i = 1; i <= 3; i++) {
    userLoader.load(i);
}
userLoader.load(3).then((res) => {
    console.log('\njust one user', res)
});
