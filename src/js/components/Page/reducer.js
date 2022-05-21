import { createSelector } from "reselect";

import { REDUCER_NAME, RESET_PAGE, SET_PAGE } from "./constants";

const initialState = {
  isReady: {},
  page: {},
};

// eslint-disable-next-line default-param-last
const reducer = (state = initialState, action) => {
  const { type, key, data } = action;
  switch (type) {
    case SET_PAGE:
      return {
        ...state,
        isReady: {
          ...state.isReady,
          [key]: true,
        },
        page: {
          ...state.page,
          [key]: data,
        },
      };
    case RESET_PAGE:
      return {
        isReady: {
          ...state.isReady,
          [key]: false,
        },
        page: {
          ...state.page,
          [key]: null,
        },
      };
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

const selectIsReady = (state, { path }) => getState(state).isReady[path];

export const makeSelectIsReady = () => createSelector(selectIsReady, (n) => n);

const selectPage = (state, { path }) => getState(state).page[path];

export const makeSelectPage = () => createSelector(selectPage, (n) => n);

export default reducer;
