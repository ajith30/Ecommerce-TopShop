import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
});

export default store;


/*
Notes: 
-------

reducer: The reducer property is an object that defines the root reducer for the store. 

[apiSlice.reducerPath] key. This sets up the API slice reducer at the specified key within the store's state.
if you console.lod(apiSlice) in apiSlice.js. you can understand this.

* "[apiSlice.reducerPath]: apiSlice.reducer" is quelent to "api: apiSlice.reducer"
  Basically  [apiSlice.reducerPath] is an "api". Which needs to be dynamicaly computed not a static.
  Here we are setting key "dynamically" for "apiSlice.reducer" value with in the reducer. 
  So we used [apiSlice.reducerPath] square bracket syntax.

middleware: The middleware property is a function that receives the getDefaultMiddleware function as a parameter. 
It is used to customize the middleware applied to the store. 

default middleware: is obtained using getDefaultMiddleware() and then the apiSlice.middleware is added using the .concat() method. 
* This ensures that the API middleware is included in the middleware chain for handling API requests and responses.

devTools: The devTools property is set to true to enable the Redux DevTools extension in the browser for debugging and development purposes.

*/