/**
 * Create a Redux store with dynamic reducers
 * Based on: https://nicolasgallagher.com/redux-modules-and-code-splitting/
 */

import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import reducerRegistry from "./reducerRegistry";
import staticReducers from "./reducers";

/**
 * Create a new Redux store and connect the reducerRegistry change listener to dynamically append reducers.
 * @param {Object} initialState
 * @param {Boolean} resetReducers
 * @returns The initialized Redux store
 */
const configureStore = (initialState = {}, resetReducers = false) => {
  const combine = (reducers) => {
    const updatedReducers = reducers;
    const reducerNames = Object.keys(reducers);
    Object.keys(initialState).forEach((item) => {
      if (reducerNames.indexOf(item) === -1) {
        updatedReducers[item] = (state = null) => state;
      }
    });
    return combineReducers(reducers);
  };

  // clears all dynamically added reducers
  if (resetReducers) {
    reducerRegistry.reset();
  }

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
    store.replaceReducer(
      combine({
        ...staticReducers,
        ...reducers,
      })
    );
  });

  return store;
};

export default configureStore;
