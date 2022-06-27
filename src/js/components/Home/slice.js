import { createSlice } from "@reduxjs/toolkit";

import reducerRegistry from "../../reducerRegistry";
import { REDUCER_NAME } from "./constants";

const initialState = {
  // extend the state with custom properties for this reducer
};

const slice = createSlice({
  name: REDUCER_NAME,
  initialState,
  reducers: {},
});

reducerRegistry.register(REDUCER_NAME, slice.reducer);

export default slice.reducer;
