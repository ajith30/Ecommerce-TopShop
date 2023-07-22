import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";


const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // item that will be added to the cart (value is an object passed in the dispatch)
      const item = action.payload;

      //checking the item already exist in the cart
      const existItem = state.cartItems.find((x) => x._id === item._id);

      //if exist item update quantity. Remember the products data fetched from server do not have quantity. 
      //So we are updating once user choose the quantity in add to cart page which is part of item obj.
      if(existItem) {
      state.cartItems = state.cartItems.map((x) => (x._id === item._id ) ? item : x);
      } else {
      state.cartItems = [...state.cartItems, item]; // we can use push also since redux uses immer library
      }

      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      //Filter out the item to remove from the cart
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      console.log(state.cartItems);
      //update the prices and save to localstorage
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;

      //Rememberin updateCart() we are saving the available sates to localStorage. 
      //Once shipping address available we are storing to localstorage as well.
      return updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.savePaymentMethod = action.payload;
      return updateCart(state);
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    }
  }
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems } = cartSlice.actions;
export default cartSlice.reducer;