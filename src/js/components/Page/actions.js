import { isError, isLoading, setMeta, setTitle } from "../App/actions";
import { RESET_PAGE, SET_PAGE } from "./constants";

const setPage = (data, key) => ({
  type: SET_PAGE,
  data,
  key,
});

export const resetPage = (key) => ({
  type: RESET_PAGE,
  key,
});

const getPage =
  (promise) =>
  ({ url }) =>
  (dispatch) => {
    dispatch(isLoading(true));
    dispatch(isError(false));

    return promise
      .then((response) => {
        dispatch(setPage(response, url));
        dispatch(setMeta(response.meta));
        dispatch(setTitle(response.title));
        dispatch(isLoading(false));
        return response;
      })
      .catch((error) => {
        dispatch(isLoading(false));
        dispatch(isError(true));
        console.error(error);
        throw error;
      });
  };

export const makeGetPage = (func) => (args) => (dispatch) =>
  getPage(func(args)(dispatch))(args)(dispatch);
