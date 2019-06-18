const DataLoader = require('dataloader');
// dataloader function must accept only an array and then return a promise with resolves to an array of equal length
const batchGetUserByIds = (ids) => {
    console.log('\nI only fire once per tick of the event loop');
    console.log(ids);

    return Promise.resolve(ids);
};
const userLoader = new DataLoader(batchGetUserByIds);

userLoader.load(1);
userLoader.load(2);
userLoader.load(3);

// Force next-ticks in event loop
setTimeout(() => {
  userLoader.load(4);
  userLoader.load(5);
  userLoader.load(6);
}, 1000);

setTimeout(() => {
    userLoader.loadMany([7,8,9]); // load many keys at once
}, 2000);
