import { createSelector } from "reselect";

import reducerRegistry from "../../reducerRegistry";
import { REDUCER_NAME, SET_ABOUT } from "./constants";

const initialState = {
  // extend the default page with custom properties for this reducer
};

// eslint-disable-next-line default-param-last
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ABOUT:
      return {
        ...state,
        isReady: true,
        isError: false,
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

export const selectIsReady = createSelector(getState, (n) => n.isReady);

export const selectAbout = createSelector(getState, (n) => ({
  // extend the default page with custom selectors for this reducer
  ...n,
}));

reducerRegistry.register(REDUCER_NAME, reducer);
