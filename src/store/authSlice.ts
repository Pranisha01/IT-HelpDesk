//this is a slice to authenticate user (login & logout)

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id?: string | number;
  username?: string;
  name?: string;
  role?: string;
}

export interface AuthState {
  status: boolean;
  userData: AuthUser | null;
}

const initialState: AuthState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userData: AuthUser }>) => {
      state.status = true;
      state.userData = action.payload.userData ?? null;
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
