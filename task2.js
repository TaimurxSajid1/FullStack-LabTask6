/*
 * Lab 6 - Task 2
 * Taimur Sajid (241839)
 *
 * Task: Use Promise.all to catch multiple promises returned by two asynchronous
 *       operations and then reject or accept the main promise (promise of
 *       Promise.all) based on if the details fetched by both the async
 *       functions are valid or not.
 *
 * The two asynchronous operations:
 *   getUser(id)    -> /users/:id          (the user's details)
 *   getCarts(id)   -> /carts/user/:id     (the user's shopping carts)
 *
 * userWithCarts(id) builds the main promise from Promise.all:
 *   Promise.all([getUser(id), getCarts(id)]).then(checkBoth)
 * Inside .then(), returning a value ACCEPTS the main promise and throwing an
 * error REJECTS it. If either request fails, Promise.all itself rejects.
 *
 * Run: node task2.js
 */

import { getJSON, makeError } from "./api.js";
import { userMistakes, cartMistakes, cleanUser } from "./validation.js";

// the two async operations
export const getUser = async (id) => getJSON(`/users/${id}`);
export const getCarts = async (id) => getJSON(`/carts/user/${id}`);

// the main promise (sources can be swapped to test invalid data)
export function userWithCarts(id, sources = { getUser, getCarts }) {
  const mainPromise = Promise.all([sources.getUser(id), sources.getCarts(id)]).then(([user, carts]) => {
    const mistakes = [
      ...userMistakes(user, id).map((m) => `user: ${m}`),
      ...cartMistakes(carts, id).map((m) => `carts: ${m}`)
    ];

    if (mistakes.length > 0) {
      throw makeError("INVALID_DETAILS", mistakes.join(" | "));      // -> main promise rejected
    }

    const items = carts.reduce((sum, cart) => sum + cart.products.reduce((s, p) => s + p.quantity, 0), 0);
    return { user: cleanUser(user), carts: carts.length, itemsInCarts: items };  // -> main promise accepted
  });

  return mainPromise;
}

/* ---------------------------- demo ---------------------------- */

// Fake sources with broken data, because the real API only sends valid carts
const brokenCarts = {
  getUser,
  getCarts: async (id) => [{ id: 50, userId: id + 1, products: [{ productId: 3, quantity: 0 }] }]
};

async function show(title, promise) {
  try {
    const result = await promise;
    console.log(`ACCEPTED  ${title}`);
    console.log(result, "\n");
  } catch (error) {
    console.log(`REJECTED  ${title}\n          ${error.code ?? "ERROR"}: ${error.message}\n`);
  }
}

console.log("TASK 2 - Promise.all\n");

let t = Date.now();
await show("user 1 with carts", userWithCarts(1));
console.log(`(both requests were sent together and finished in ${Date.now() - t} ms)\n`);

await show("user 3 with carts", userWithCarts(3));
await show("user 999 - the API sends null for this user", userWithCarts(999));
await show("user 2 with a broken cart (fake data)", userWithCarts(2, brokenCarts));
