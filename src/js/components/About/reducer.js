import { createSelector } from "reselect";

import { REDUCER_NAME, SET_ABOUT } from "./constants";

const initialState = {
  // extend the state with custom properties for this reducer
  date: null,
};

// eslint-disable-next-line default-param-last
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ABOUT:
      return {
        ...state,
        date: action.data.date,
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
  date: n.date && new Date(n.date).toLocaleDateString(),
}));

export default reducer;
