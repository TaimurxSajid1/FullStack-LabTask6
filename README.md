# Lab 6: async/await and Promise.all

**Name:** Taimur Sajid
**Roll No:** 241839

**API:** [Fake Store API](https://fakestoreapi.com), using `/users/:id` and `/carts/user/:id`.

## Files

| File | Purpose |
|---|---|
| `api.js` | `getJSON()`, a `fetch` wrapper that throws errors with a `code` (`NETWORK_ERROR`, `HTTP_ERROR`, `BAD_JSON`) |
| `validation.js` | checks that a user and a list of carts are valid |
| `task1.js` | Task 1 |
| `task2.js` | Task 2 |

## Task 1: `fetchValidUser(userId)`

*Implement an async await function that returns a valid user object on successful fetching from an api and returns an error on unsuccessful fetching.*

The function `await`s the request, validates the user, and returns a clean user object with name, username,
email, phone and city. The password the API sends is removed. On failure it gives back an error, so the
caller's `try/catch` receives it. The error's `code` says what happened:

- `INVALID_ID`: the id is not a positive whole number.
- `NETWORK_ERROR`, `HTTP_ERROR` or `BAD_JSON`: the request itself failed.
- `INVALID_USER`: the user data is not valid. This API answers a missing user such as 999 with status **200 and `null`**, so the request "succeeds" but no valid user comes back. Validation catches this.

## Task 2: `userWithCarts(id)`

*Use Promise.all to catch multiple promises returned by two asynchronous operations and then reject or accept the main promise based on if the details fetched by both the async functions are valid or not.*

`getUser(id)` and `getCarts(id)` start together inside `Promise.all`. The main promise is
`Promise.all([...]).then(checkBoth)`:

- If both the user and the carts are valid, `.then` returns the result and the main promise is **accepted**.
- If either is invalid, `.then` throws an `INVALID_DETAILS` error and the main promise is **rejected**.
- If either request fails, `Promise.all` rejects, so the main promise is **rejected**.

The last demo case passes a fake `getCarts` that returns a broken cart, to show the rejection for invalid
cart details.

## Run

Requires Node.js 18 or newer.

```
node task1.js
node task2.js
```
