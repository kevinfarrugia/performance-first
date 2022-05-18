import { createSelector } from "reselect";

import reducerRegistry from "../../reducerRegistry";
import { REDUCER_NAME, RESET_PAGE, SET_PAGE } from "./constants";

const initialState = {
  isReady: {},
  page: {},
};

// eslint-disable-next-line default-param-last
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        isReady: {
          ...state.isReady,
          [action.key]: true,
        },
        page: {
          ...state.page,
          [action.key]: action.data,
        },
      };
    case RESET_PAGE:
      return {
        isReady: {
          ...state.isReady,
          [action.key]: false,
        },
        page: {
          ...state.page,
          [action.key]: null,
        },
      };
    default:
      return state;
  }
};

export const getState = (state) => {
  if (state[REDUCER_NAME]) {
    return state[REDUCER_NAME];
  }
  return initialState;
};

const selectIsReady = (state, { url }) => getState(state).isReady[url];

export const makeSelectIsReady = () => createSelector(selectIsReady, (n) => n);

const selectPage = (state, { url }) => getState(state).page[url];

export const makeSelectPage = () => createSelector(selectPage, (n) => n);

reducerRegistry.register(REDUCER_NAME, reducer);
