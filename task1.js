/*
 * Lab 6 - Task 1
 * Taimur Sajid (241839)
 *
 * Task: Implement an async await function that returns a valid user object
 *       on successful fetching from an api and returns an error on
 *       unsuccessful fetching.
 *
 * fetchValidUser(userId)
 *   - awaits the request to https://fakestoreapi.com/users/:id
 *   - success: resolves with a clean, valid user object
 *   - failure: the async function gives back an error (its promise rejects),
 *              and error.code says why:
 *                INVALID_ID, NETWORK_ERROR, HTTP_ERROR, BAD_JSON, INVALID_USER
 *
 * Note: this API answers a missing user with status 200 and a body of null,
 * so a "successful" request can still be an unsuccessful fetch. The validation
 * step catches that.
 *
 * Run: node task1.js
 */

import { getJSON, makeError } from "./api.js";
import { userMistakes, cleanUser } from "./validation.js";

export async function fetchValidUser(userId) {
  if (typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) {
    throw makeError("INVALID_ID", `"${userId}" is not a valid user id`);
  }

  const data = await getJSON(`/users/${userId}`);

  const mistakes = userMistakes(data, userId);
  if (mistakes.length) {
    throw makeError("INVALID_USER", `user ${userId} could not be used: ${mistakes.join("; ")}`);
  }

  return cleanUser(data);
}

/* ---------------------------- demo ---------------------------- */

const ids = [1, 4, 10, 999, -3, "7"];

console.log("TASK 1 - async / await\n");

for (const id of ids) {
  try {
    const user = await fetchValidUser(id);
    console.log(`[OK]    fetchValidUser(${JSON.stringify(id)})`);
    console.table(user);
  } catch (error) {
    console.log(`[ERROR] fetchValidUser(${JSON.stringify(id)})  ${error.code}: ${error.message}\n`);
  }
}
