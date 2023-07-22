import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";


const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //We are making post request to backend server
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      })
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST"
      })
    }),

    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data
      })
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      })
    })
  })
});

//console.log(userApiSlice);

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation } = userApiSlice;