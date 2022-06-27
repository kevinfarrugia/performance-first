import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchPage } from "../../../service/Page";
import { REDUCER_NAME } from "./constants";

const initialState = {
  isReady: {},
  page: {},
};

const getPage = createAsyncThunk(`${REDUCER_NAME}/getPage`, async (data) => {
  const { path } = data;
  const response = await fetchPage({ path });
  return { path, page: response, meta: response?.meta };
});

const slice = createSlice({
  name: REDUCER_NAME,
  initialState,
  reducers: {
    resetPage(state, { payload }) {
      state.isReady[payload.path] = false;
      state.page[payload.path] = null;
    },
    setPage(state, { payload }) {
      state.isReady[payload.path] = true;
      state.page[payload.path] = payload.page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPage.fulfilled, (state, { payload }) => {
      state.isReady[payload.path] = true;
      state.page[payload.path] = payload.page;
    });
  },
});

const makeGetPage = (thunk) => (data) => async (dispatch) => {
  const { path } = data;
  const { payload } = await dispatch(thunk(data));
  return dispatch(
    slice.actions.setPage({ path, page: payload, meta: payload?.meta })
  );
};

export { getPage, makeGetPage };
export const { setPage, resetPage } = slice.actions;
export default slice.reducer;
