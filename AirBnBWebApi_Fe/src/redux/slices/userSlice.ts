import { createSlice } from "@reduxjs/toolkit";

interface UserState {


}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {

  },
});

export const { } = userSlice.actions;

export default userSlice.reducer;
