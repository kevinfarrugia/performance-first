import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchAbout } from "../../../service/About";
import { makeGetPage } from "../Page/thunks";
import { REDUCER_NAME } from "./constants";

const getAbout = createAsyncThunk(`${REDUCER_NAME}/getAbout`, async (data) => {
  const { path } = data;
  const response = await fetchAbout({ path });
  return response;
});

const getAboutPage = (data) => (dispatch) =>
  makeGetPage(getAbout)(data)(dispatch);

export { getAbout, getAboutPage };
