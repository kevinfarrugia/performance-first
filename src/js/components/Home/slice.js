import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchHome } from "../../../service/Home";
import reducerRegistry from "../../reducerRegistry";
import { makeGetPage } from "../Page/slice";
import { REDUCER_NAME } from "./constants";

const initialState = {
  // extend the state with custom properties for this reducer
};

const getHome = createAsyncThunk(`${REDUCER_NAME}/getHome`, async () => {
  const response = await fetchHome();
  return response;
});

const getHomePage = (data) => (dispatch) =>
  makeGetPage(getHome)(data)(dispatch);

const slice = createSlice({
  name: REDUCER_NAME,
  initialState,
  reducers: {},
});

reducerRegistry.register(REDUCER_NAME, slice.reducer);

export { getHome, getHomePage };
export default slice.reducer;
