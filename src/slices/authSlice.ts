import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  authUser: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser(state, action) {
      state.authUser = action.payload;
    },

    extraReducers: {
      [HYDRATE]: (state: any, action: { payload: { auth: any; }; }) => {
        return {
          ...state,
          ...action.payload.auth,
        };
      },
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export const selectAuthUser = (state: { auth: { authUser: any; }; }) => state.auth.authUser;
export default authSlice.reducer;