import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchAbout } from "../../../service/About";
import reducerRegistry from "../../reducerRegistry";
import { makeGetPage } from "../Page/slice";
import { REDUCER_NAME } from "./constants";

const initialState = {
  // extend the state with custom properties for this reducer
  date: null,
};

const getAbout = createAsyncThunk(`${REDUCER_NAME}/getAbout`, async (data) => {
  const { path } = data;
  const response = await fetchAbout({ path });
  return response;
});

const getAboutPage = (data) => (dispatch) =>
  makeGetPage(getAbout)(data)(dispatch);

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

export { getAbout, getAboutPage };
export default slice.reducer;
