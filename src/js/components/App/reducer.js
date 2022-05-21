import { createSelector } from "reselect";

import {
  APP_ERROR,
  APP_LOADING,
  REDUCER_NAME,
  SET_BOUNDARY_ERROR,
  SET_DEFERRED_PROMPT,
  SET_META,
  SET_PATH,
} from "./constants";

const initialState = {
  deferredPrompt: null,
  isLoading: true,
  isError: false,
  isBoundaryError: false,
  meta: {},
  title: "",
  path: "",
};

// eslint-disable-next-line default-param-last
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case APP_LOADING:
      return { ...state, isLoading: action.data };
    case APP_ERROR:
      return { ...state, isError: action.data };
    case SET_BOUNDARY_ERROR:
      return { ...state, isBoundaryError: action.data };
    case SET_DEFERRED_PROMPT:
      return { ...state, deferredPrompt: action.data };
    case SET_META:
      return { ...state, meta: action.data };
    case SET_PATH:
      return { ...state, path: action.data };
    default:
      return state;
  }
};

const getState = (state) => {
  if (state[REDUCER_NAME]) {
    return state[REDUCER_NAME];
  }
  return initialState;
};

export const selectIsLoading = createSelector(getState, (n) => n.isLoading);

export const selectIsError = createSelector(getState, (n) => n.isError);

export const selectIsBoundaryError = createSelector(
  getState,
  (n) => n.isBoundaryError
);

export const selectDeferredPrompt = createSelector(
  getState,
  (n) => n.deferredPrompt
);

export const selectMeta = createSelector(getState, (n) => n.meta);

export const selectPath = createSelector(getState, (n) => n.path);

export default reducer;
