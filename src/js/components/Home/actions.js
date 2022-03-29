import { fetchHome } from "../../../service/Home";
import { makeGetPage } from "../Page/actions";

export const getHome = (data) => () =>
  fetchHome(data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });

export const getHomePage = (data) => (dispatch) =>
  makeGetPage(getHome)(data)(dispatch);
