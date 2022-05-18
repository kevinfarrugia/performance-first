/**
 * Create the store with dynamic reducers
 * Based on: https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application
 */

import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import AppReducer from "./components/App/reducer";
import AppRouterReducer from "./components/AppRouter/reducer";
import reducerRegistry from "./reducerRegistry";

// default reducers available by default
const staticReducers = {
  app: AppReducer,
  routes: AppRouterReducer,
};

const configureStore = (initialState = {}) => {
  const combine = (reducers) => {
    const reducerNames = Object.keys(reducers);
    Object.keys(initialState).forEach((item) => {
      if (reducerNames.indexOf(item) === -1) {
        // eslint-disable-next-line no-param-reassign
        reducers[item] = (state = null) => state;
      }
    });
    return combineReducers(reducers);
  };

  const reducer = combine({
    ...staticReducers,
    ...reducerRegistry.getReducers(),
  });

  const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );

  // Replace the store's reducer whenever a new reducer is registered.
  reducerRegistry.setChangeListener((reducers) => {
    store.replaceReducer(combine(reducers));
  });

  return store;
};

export default configureStore;
