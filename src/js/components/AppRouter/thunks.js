import { createAsyncThunk } from "@reduxjs/toolkit";

import { getRoutingTable } from "../../../service/Router";
import { REDUCER_NAME } from "./constants";

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

// eslint-disable-next-line import/prefer-default-export
export { getRoutes };
