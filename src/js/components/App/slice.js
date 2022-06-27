import { createSlice } from "@reduxjs/toolkit";

import { getPage, setPage } from "../Page/slice";
import { REDUCER_NAME } from "./constants";

const initialState = {
  deferredPrompt: null,
  isLoading: true,
  isError: false,
  isBoundaryError: false,
  meta: {},
  path: "",
};

const slice = createSlice({
  name: REDUCER_NAME,
  initialState,
  reducers: {
    setIsLoading(state, { payload }) {
      state.isLoading = payload;
    },
    setIsError(state, { payload }) {
      state.isError = payload;
    },
    setBoundaryError(state, { payload }) {
      state.isBoundaryError = payload;
    },
    setDeferredPrompt(state, { payload }) {
      state.deferredPrompt = payload;
    },
    setPath(state, { payload }) {
      state.path = payload.path;
    },
    setMeta(state, { payload }) {
      state.meta = payload.meta;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPage.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(getPage.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addCase(getPage.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isError = false;
      state.meta = payload.meta;
      state.path = payload.path;
    });
    builder.addCase(setPage, (state, { payload }) => {
      state.isLoading = false;
      state.isError = false;
      state.meta = payload.meta;
      state.path = payload.path;
    });
  },
});

export const {
  setIsLoading,
  setIsError,
  setBoundaryError,
  setDeferredPrompt,
  setPath,
  setMeta,
} = slice.actions;

export default slice.reducer;
