import { createSelector } from "reselect";

import { REDUCER_NAME, SET_ROUTES } from "./constants";

const initialState = {
  routes: [],
};

// eslint-disable-next-line default-param-last
const AppRouterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROUTES:
      return { ...state, routes: action.data };
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

export const selectRoutes = createSelector(getState, (n) => n.routes);

export default AppRouterReducer;
