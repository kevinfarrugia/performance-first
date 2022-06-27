import { createSlice } from "@reduxjs/toolkit";

import reducerRegistry from "../../reducerRegistry";
import { REDUCER_NAME } from "./constants";
import { getAbout } from "./thunks";

const initialState = {
  // extend the state with custom properties for this reducer
  date: null,
};

const slice = createSlice({
  name: REDUCER_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAbout.fulfilled, (state, { payload }) => {
      state.date = payload.date;
    });
  },
});

reducerRegistry.register(REDUCER_NAME, slice.reducer);

export default slice.reducer;
