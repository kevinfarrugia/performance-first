import { createSelector } from "reselect";

import reducerRegistry from "../../reducerRegistry";
import { REDUCER_NAME, SET_HOME } from "./constants";

const initialState = {
  // TODO: unused
  name: "",
};

// eslint-disable-next-line default-param-last
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HOME:
      return {
        ...state,
        name: action.data.name,
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

export const selectHome = createSelector(getState, (n) => ({
  name: n.name,
}));

reducerRegistry.register(REDUCER_NAME, reducer);
