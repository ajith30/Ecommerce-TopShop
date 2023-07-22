import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL
      }),
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`
      }),
      keepUnusedDataFor: 5,
    })
  })
});
//console.log(productSlice);

export const { useGetProductsQuery, useGetProductDetailsQuery } = productSlice;


/* 
Notes:
------
The apiSlice:
-------------
  It is the API slice object that was previously created using createApi. 
It represents the base API slice that you want to extend with new endpoints.

apiSlice.injectEndpoints:
-------------------------
   It is called with an object that contains the configuration for the new endpoints you want to add.
apiSlice.injectEndpoints is a method provided by RTK Query that allows you to define additional endpoints and customize the behavior of an API slice.

endpoints: 
----------
  The endpoints property is a function that receives a "builder" object as its parameter. Inside this function,
you define the new endpoints using the methods provided by the builder object.

Each endpoint is defined using "builder.query()"", which is used for making a query request.
Ex:  two endpoints are defined: "getProducts" and "getProductDetails"

query function:
---------------
  It is defined for each endpoint, where you can customize the behavior of the query request. 
It can take parameters and return an object representing the query options, such as the url.

keepUnusedDataFor:(default value is 60 seconds)
------------------
This option specifies how long the data fetched by the endpoint should be kept in the cache, even if it is not actively used. 
In your code, it is set to 5 minutes.
*/