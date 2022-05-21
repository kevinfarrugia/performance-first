import { fetchAbout } from "../../../service/About";
import { makeGetPage } from "../Page/actions";
import { SET_ABOUT } from "./constants";

const setAbout = (data) => ({
  type: SET_ABOUT,
  data,
});

export const getAbout = (data) => (dispatch) =>
  fetchAbout(data)
    .then((response) => {
      dispatch(setAbout(response));
      return response;
    })
    .catch((error) => {
      throw error;
    });

export const getAboutPage = (data) => (dispatch) =>
  makeGetPage(getAbout)(data)(dispatch);
