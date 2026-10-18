/*
 * Lab 6 - API helper
 * Taimur Sajid (241839)
 *
 * Small wrapper around fetch() for the Fake Store API.
 * It throws an Error with a "code" property so the caller knows what went wrong:
 *   NETWORK_ERROR   the server could not be reached
 *   HTTP_ERROR      the server answered with a bad status (404, 500, ...)
 *   BAD_JSON        the answer could not be read as JSON
 */

export const API = "https://fakestoreapi.com";

export function makeError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export async function getJSON(path) {
  let res;
  try {
    res = await fetch(API + path);
  } catch (networkProblem) {
    throw makeError("NETWORK_ERROR", `cannot reach ${API} (${networkProblem.message})`);
  }

  if (!res.ok) {
    throw makeError("HTTP_ERROR", `${path} answered with status ${res.status}`);
  }

  try {
    return await res.json();
  } catch {
    throw makeError("BAD_JSON", `${path} did not return valid JSON`);
  }
}
