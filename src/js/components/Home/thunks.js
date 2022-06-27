import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchHome } from "../../../service/Home";
import { makeGetPage } from "../Page/thunks";
import { REDUCER_NAME } from "./constants";

const getHome = createAsyncThunk(`${REDUCER_NAME}/getHome`, async () => {
  const response = await fetchHome();
  return response;
});

const getHomePage = (data) => (dispatch) =>
  makeGetPage(getHome)(data)(dispatch);

export { getHome, getHomePage };
