const DataLoader = require('dataloader');

const fakeDB = ['Tom', 'Bo', 'Kate', 'Sara'];

const batchGetUserByIds = async (ids) => {
    return ids.map(id => fakeDB[id - 1]);
};
const userLoader = new DataLoader(batchGetUserByIds);

console.log('\nEvent Tick 1');
userLoader.load(1).then(console.log);
userLoader.load(2).then(console.log);

setTimeout(() => {
    console.log('\nEvent Tick 2');
    userLoader.loadMany([3, 4]).then((res) => {
        console.log('Returns an array of values: ', res);
    });
}, 1000);
