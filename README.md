# How do DataLoaders work?
## And how do they solve GraphQL's N+1 problem?

Heavily inspired by this [article on DataLoaders](https://medium.com/@gajus/using-dataloader-to-batch-requests-c345f4b23433)

# A BRIEF overview of N+1
Here is the problem we are talking about. Lets say I have a DB of authors and their books, simple a simple "has many" relationship. Now, I want to get all my authors, and all their books. In REST, you'd make a route that uses your ORM of choice to execute 2 queries: one to get all the authors, and one to get all the books that were written by them. To use pseudo SQL, this is kind of what your ORM would do:

```sql
SELECT *
FROM authors;
# pretend this returns 3 authors

SELECT *
FROM books
WHERE author_id in (?, ?, ?) -- an array of the author's ids
```

Boom done. 2 queries. Hot stuff. Here's the issue, this only works because your second query already had a list of every author id. GraphQL doesn't work that way since each resolver function only knows about its own parent. So this GraphQL query:

```graphql
{
    query {
        authors {
            name
            age
            books {
                name
                genre
            }
        }
    }
}
```

would have to hit the db once to get all the authors like before, but then have to hit the db again for every author, since each `books` resolver fires independently and only knows its own parent author's id:

```sql
SELECT *
FROM authors;

SELECT *
FROM books
WHERE author_id in (1);

SELECT *
FROM books
WHERE author_id = 2;

SELECT *
FROM books
WHERE author_id = 3;
```

This is what N+1 means, 1 query for the initial group lookup, and then another N queries based on the N (number) of results it found. This is is obviously inefficient and a problem.

# Dataloader to the rescue
Dataloader does a bunch of really useful things, but it's main purpose is to batch calls. Whenever you call a dataloader to look up a key, it doesn't hit the DB right away. It collects all the key requests in a single tick of the event loop, puts them together into an array, and THEN hits the db. It stores the return values as an array in a promise. This is so each individual call in a resolver can await the result for its key, and use that single value.

The magic part of all this is you get the performance boost of only making batched calls to your DB, while each original call is essentially treated as if it was the only call that mattered.

basically it waits until it knows about every resolver function in that request, bundles their

#

Now that it knows the results, it goes back to each individual call from the resolver, and resolves the value associated with that key.