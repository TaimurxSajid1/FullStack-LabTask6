/*
 * Lab 6 - validation rules
 * Taimur Sajid (241839)
 *
 * Each function returns an array of mistakes. An empty array means the data is valid.
 */

const emailPattern = /^\S+@\S+\.\S+$/;

export function userMistakes(user, expectedId) {
  if (user === null || user === undefined) return ["the API sent no user (null)"];
  if (typeof user !== "object") return ["user data is not an object"];

  const mistakes = [];
  if (user.id !== expectedId) mistakes.push(`id should be ${expectedId} but is ${user.id}`);
  if (!user.username) mistakes.push("username is empty");
  if (!emailPattern.test(user.email ?? "")) mistakes.push(`"${user.email}" is not a valid email`);
  if (!user.name?.firstname || !user.name?.lastname) mistakes.push("first or last name is missing");
  return mistakes;
}

export function cartMistakes(carts, expectedUserId) {
  if (!Array.isArray(carts)) return ["carts is not a list"];

  const mistakes = [];
  carts.forEach((cart) => {
    if (cart.userId !== expectedUserId) mistakes.push(`cart ${cart.id} is for user ${cart.userId}, not ${expectedUserId}`);
    if (!Array.isArray(cart.products) || cart.products.length === 0) {
      mistakes.push(`cart ${cart.id} has no products`);
      return;
    }
    cart.products.forEach((item) => {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        mistakes.push(`cart ${cart.id}: product ${item.productId} has quantity ${item.quantity}`);
      }
    });
  });
  return mistakes;
}

// Only the fields we want to show (the API also sends a password, which we drop)
export function cleanUser(user) {
  const capital = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  return {
    id: user.id,
    name: `${capital(user.name.firstname)} ${capital(user.name.lastname)}`,
    username: user.username,
    email: user.email,
    phone: user.phone,
    city: user.address ? capital(user.address.city) : "-"
  };
}
