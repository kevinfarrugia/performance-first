import { fetchAbout } from "../../../service/About";
import { makeGetPage } from "../Page/actions";

export const getAbout = (data) => () =>
  fetchAbout(data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });

export const getAboutPage = (data) => (dispatch) =>
  makeGetPage(getAbout)(data)(dispatch);
