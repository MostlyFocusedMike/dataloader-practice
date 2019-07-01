const DataLoader = require('dataloader');

const fakeDB = ['Tom', 'Bo', 'Kate', 'Sara', 'Gene', 'Noel'];

const batchGetUserById = async (ids) => {
    console.log('called once per tick with all ids:', ids);
    return ids.map(id => fakeDB[id - 1]);
};
const userLoader = new DataLoader(batchGetUserById);

console.log('\nEvent Tick 1');
userLoader.load(1);
userLoader.load(2).then((user) => {
    // we will only get a single user, not an array
    console.log('here is the user: ', user);
});

setTimeout(() => {
    console.log('\nEvent Tick 2');
    userLoader.load(3);
    userLoader.load(4);
}, 1000);

setTimeout(() => {
    console.log('\nEvent Tick 3');
    userLoader.load(5);
    userLoader.load(6);
}, 2000);
