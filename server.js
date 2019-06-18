const DataLoader = require('dataloader');
const fakeDB = ['tom', 'aly', 'jo', 'bill', 'sara', 'cara', 'ted', 'greg', 'finn', 'adam']
// dataloader function must accept only an array and then return a promise with resolves to an array of equal length
const batchGetUserByIds = (ids) => {
    console.log('\nI only fire once per tick of the event loop');
    const fakeUsers = ids.map(x => ({
         id: x,
         name: fakeDB[x]
    }))
    console.log('fake db results:', fakeUsers);

    return Promise.resolve(fakeUsers);
};
const userLoader = new DataLoader(batchGetUserByIds);
// so pretend you get a GQL query which wants all the users

userLoader.load(1);
userLoader.load(2).then((res) => {
    console.log('\njust one user', res)
/*
    notice how res is just one user, not all of them
    and it ultimately gets returned after mybatchGetUserIds runs
    (proven by the console log order and only going once)

    so the dataloader runs the loaderFunction once per tick,
    it then saves the results in a promise which returns an array
    then, if any of the .load()'s actually use their return value,
    it looks at its resolved values in the array, and returns only
    the value for the given key

    In this case, it says, "oh, load() was run with the key 2,
    here is the value that I ultimately returned for that"
*/
});
userLoader.load(3);

// notice how this doesn't get run again since it was cached
// but we still get access to all the values
userLoader.loadMany([1,2,3]).then(res => {
    console.log('\ncached result', res);
});

// Force next-ticks in event loop
setTimeout(() => {
  userLoader.load(4);
  userLoader.load(5);
  userLoader.load(6);
}, 1000);

setTimeout(() => {
    userLoader.loadMany([7,8,9]); // load many keys at once
}, 2000);

/*

so .load() essentially loads a single key into the actual load function:

userLoader.load(1)
# getPostTagsUsingPostId([1])

userLoader.load(2)
# now it's getPostTagsUsingPostId([1, 2])

userLoader.load(2)
# finally it's getPostTagsUsingPostId([1, 2, 3])
# but this is the last load of this event loop, so it finally fires
*/