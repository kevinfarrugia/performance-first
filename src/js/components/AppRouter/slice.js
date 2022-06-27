import { createSlice } from "@reduxjs/toolkit";

import { REDUCER_NAME } from "./constants";
import { getRoutes } from "./thunks";

const initialState = {
  routes: [],
};

const slice = createSlice({
  name: REDUCER_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoutes.fulfilled, (state, { payload }) => {
      state.routes = payload;
    });
  },
});

export default slice.reducer;
