import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: (localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")) : null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      //Once cookie expired in 1 hr protected routes in the backend server will not be accessible without logged in.
      //But in front end since we written logic based on userInfo and once use logged in userInfo state always not null user still be loggedin
      //client side It leads to errors. So to avaid errors and conflict user have to login again inorder to generate token again.

      //Implementing Below for once token expired and if to proceed further from currentpage redirect to login(logic written in App component).
      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hr

      //const expirationTime = new Date().getTime() + 120 * 1000; // 2 minute (For testing purpouse).
      localStorage.setItem("expirationTime", expirationTime);

    },

    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    }

  }
})

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;