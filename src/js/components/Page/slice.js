import { createSlice } from "@reduxjs/toolkit";

import { REDUCER_NAME } from "./constants";
import { getPage, setPage } from "./thunks";

const initialState = {
  isReady: {},
  page: {},
};

const slice = createSlice({
  name: REDUCER_NAME,
  initialState,
  reducers: {
    resetPage(state, { payload }) {
      state.isReady[payload.path] = false;
      state.page[payload.path] = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPage.fulfilled, (state, { payload }) => {
      state.isReady[payload.path] = true;
      state.page[payload.path] = payload.page;
    });
    builder.addCase(setPage, (state, { payload }) => {
      state.isReady[payload.path] = true;
      state.page[payload.path] = payload.page;
    });
  },
});

export const { resetPage } = slice.actions;

export default slice.reducer;
