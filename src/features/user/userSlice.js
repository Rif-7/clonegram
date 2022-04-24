import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  uid: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    userLoggedIn(state, action) {
      const { user, userId } = action.payload;
      state.user = user;
      state.uid = userId;
    },
    userLoggedOut(state) {
      state.user = null;
      state.uid = "";
    },
  },
});

export default userSlice.reducer;

export const { userLoggedIn, userLoggedOut } = userSlice.actions;
