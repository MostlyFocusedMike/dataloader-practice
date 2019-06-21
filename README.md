# How do DataLoaders work?
## And how do they solve GraphQL's N+1 problem?

Heavily inspired by this [article on DataLoaders](https://medium.com/@gajus/using-dataloader-to-batch-requests-c345f4b23433)

# A BRIEF overview of N+1
Here is the problem we are talking about. I want to get all my authors, and all their book titles. Seems simple, right? In rest,you'd make an route with a Database query with your ORM of choice to execute 2 queries: one to get all the authors, and one to get all the books that were written by them. To use pseudo SQL, this is kind of what your ORM would do:

```sql
SELECT *
FROM authors;
# pretend this returns 3 authors

SELECT *
FROM books
WHERE author_id in (?, ?, ?)
# Those '?' are each of the author ids
```

Boom done. 2 queries. Hot stuff. Here's the issue, this only works becuase your second query already had a list of every author id. GraphQL doesn't work that way. Each resolver only knows about its parent, that's one author at a time. So this GraphQL query:

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

would have to hit the db once to get all the authors like before, but then have to hit the db again for every author since each `books` resolver fires independently and only knows its own author's id:

```sql
SELECT *
FROM authors;

SELECT *
FROM books
WHERE author_id = 1;

SELECT *
FROM books
WHERE author_id = 2;

SELECT *
FROM books
WHERE author_id = 3;
```

This is what N+1 means, 1 query for the inital group lookup, and then another N queries based on the N (number) of results it found. This is