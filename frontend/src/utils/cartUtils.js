//Helper function to take a number, round it to two decimal places
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
}


export const updateCart = (state, item) => {

  // Calculate the item price
  state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));

  // Calculate the shipping price (If items price is greater than $ 100, shipping is free | If not, shipping is $ 10)
  state.shippingPrice = addDecimals((state.itemsPrice > 100) ? 0: 10);

  // Calculate the tax price (Tax is 15% of the items price)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  // Calculate the total price which is sum of item price, Shipping price and Tax price
  state.totalPrice = (
    Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)
  ).toFixed(2);

  // save the cart state to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
}