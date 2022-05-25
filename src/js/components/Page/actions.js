import { fetchPage } from "../../../service/Page";
import { setIsError, setIsLoading, setMeta, setPath } from "../App/actions";
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

const getPageFactory =
  (promise) =>
  ({ path }) =>
  (dispatch) => {
    dispatch(setIsLoading(true));
    dispatch(setIsError(false));

    return promise
      .then((response) => {
        dispatch(setPage(response, path));
        dispatch(setPath(path));
        dispatch(setMeta(response.meta));
        dispatch(setIsLoading(false));
        return response;
      })
      .catch((error) => {
        dispatch(setIsLoading(false));
        dispatch(setIsError(true));
        console.error(error);
        throw error;
      });
  };

export const makeGetPage = (func) => (args) => (dispatch) =>
  getPageFactory(func(args)(dispatch))(args)(dispatch);

export const getPage =
  ({ path }) =>
  (dispatch) =>
    fetchPage({ path })
      .then((response) => {
        dispatch(setPath(path));
        if (response) {
          dispatch(setPage(response, path));
          dispatch(setMeta(response.meta));
        }
        return response;
      })
      .catch((error) => {
        throw error;
      });
