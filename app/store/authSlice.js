'use client'
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const BACKEND_URL = "http://localhost:7777"; 

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

 export const registerUser = createAsyncThunk(
  "/register",
  async ({ name, email, password }) => {
    try {
      const result = await axios.post(
        `${BACKEND_URL}/api/register`,
        { name, email, password },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);


export const loginUser = createAsyncThunk(
  "/login",
  async ({ email, password }) => {
    try {
      const result = await axios.post(
        `${BACKEND_URL}/api/login`,
        { email, password },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      return error?.response?.data;
    }
  }
);
 const authSlice = createSlice({
  name: "auth",
  initialState,  
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true ;
         state.user = action.payload?.user || null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
