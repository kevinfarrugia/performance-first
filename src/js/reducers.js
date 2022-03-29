/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineReducers } from "redux";

// global reducers
import AppReducer from "./components/App/reducer";
import AppRouterReducer from "./components/AppRouter/reducer";
import reducerRegistry from "./util/reducerRegistry";

// Preserve initial state for not-yet-loaded reducers
const getDynamicReducers = (reducers, initialState) => {
  const reducerNames = Object.keys(reducers);
  const staticReducerNames = Object.keys(reducers);
  const output = reducers;
  Object.keys(initialState).forEach((item) => {
    if (
      reducerNames.indexOf(item) === -1 &&
      staticReducerNames.indexOf(item) !== -1
    ) {
      output[item] = (state = null) => state;
    }
  });
  return output;
};

// default reducers available by default
const staticReducers = {
  app: AppReducer,
  routes: AppRouterReducer,
};

const createReducer = ({ reducers, initialState }) => {
  const dynamicReducers = getDynamicReducers(
    reducers || reducerRegistry.getReducers(),
    initialState
  );

  return combineReducers({
    ...staticReducers,
    ...dynamicReducers,
  });
};

export { staticReducers, createReducer };
