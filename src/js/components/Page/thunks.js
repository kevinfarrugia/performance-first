import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchPage } from "../../../service/Page";
import { REDUCER_NAME } from "./constants";

export const setPage = createAction(`${REDUCER_NAME}/setPage`);

const getPage = createAsyncThunk(`${REDUCER_NAME}/getPage`, async (data) => {
  const { path } = data;
  const response = await fetchPage({ path });
  return { path, page: response, meta: response?.meta };
});

const makeGetPage = (thunk) => (data) => async (dispatch) => {
  const { path } = data;
  const { payload } = await dispatch(thunk(data));
  return dispatch(setPage({ path, page: payload, meta: payload?.meta }));
};

export { getPage, makeGetPage };
