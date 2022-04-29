import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  uid: "",
  dateOfBirth: "",
  description: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    userLoggedIn(state, action) {
      const { user, userId, description, dateOfBirth } = action.payload;
      return {
        user,
        uid: userId,
        description,
        dateOfBirth,
      };
    },
    userLoggedOut(state) {
      state.user = null;
      state.uid = "";
      state.description = "";
      state.dateOfBirth = "";
    },
  },
});

export default userSlice.reducer;

export const { userLoggedIn, userLoggedOut } = userSlice.actions;
