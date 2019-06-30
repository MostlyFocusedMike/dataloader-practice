const DataLoader = require('dataloader');
const fakeDB = ['Tom', 'Bo', 'Kate', 'Sara']

const batchGetUserByIds = async (ids) => {
    console.log('called only once per tick', ids);
    return ids.map(id => fakeDB[id - 1]);
};
const userLoader = new DataLoader(batchGetUserByIds);

console.log('\nEvent Tick 1')
userLoader.load(1);
userLoader.load(2);

// the cached one
setTimeout(() => {
    console.log('\nEvent Tick 2')
    // it is cached, so the batch isn't called we just get the value
    userLoader.load(6).then(res => {
        console.log('cached res: ', res);
    });
}, 3000);
