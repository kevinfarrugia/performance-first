import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getRoutingTable } from "../../../service/Router";
import { REDUCER_NAME } from "./constants";

const initialState = {
  routes: [],
};

const getRoutes = createAsyncThunk(
  `${REDUCER_NAME}/getRoutes`,
  async (data, { rejectWithValue }) => {
    try {
      const response = await getRoutingTable(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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

export { getRoutes };
export default slice.reducer;
