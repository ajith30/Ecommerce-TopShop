import { fetchBaseQuery,createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";


const baseQuery = fetchBaseQuery({baseUrl: BASE_URL});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({

  })
});

//console.log(apiSlice);

/*
Notes:
-------
RTK Query is an additional package provided by Redux Toolkit that simplifies API data fetching and caching within Redux applications.

ThefetchBaseQuery function and createApi function are specific to RTK Query. 
fetchBaseQuery sets up the base function for making API requests,
while createApi is used to define the API slice and configure the endpoints.

By using RTK Query, you can streamline the process of working with APIs in Redux, reducing boilerplate and 
improving efficiency in data fetching and caching.


* fetchBaseQuery is used to create a base query that will be used for making API requests. 
It is configured with a baseUrl obtained from the BASE_URL constant.

* createApi is called with the baseQuery and other options to create API slice.

* tagTypes are specified as an array of strings representing different types of tags that can be associated with API responses.

* endpoints function is provided to define the different endpoints of the API.

*/