/**
 * Create a Redux store with dynamic reducers
 * Based on: https://nicolasgallagher.com/redux-modules-and-code-splitting/
 */

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import reducerRegistry from "./reducerRegistry";

/**
 * Create a new Redux store and connect the reducerRegistry change listener to dynamically append reducers.
 * @param {Object} initialState
 * @param {Boolean} resetReducers
 * @param {Object} initialReducers
 * @param {Boolean} devtools
 * @returns The initialized Redux store
 */
const configureDynamicStore = (
  initialState = {},
  resetReducers = false,
  initialReducers = {},
  devtools = false
) => {
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
    ...initialReducers,
    ...reducerRegistry.getReducers(),
  });

  const store = configureStore({
    reducer,
    preloadedState: initialState,
    devtools,
  });

  // Replace the store's reducer whenever a new reducer is registered.
  reducerRegistry.setChangeListener((reducers) => {
    store.replaceReducer(
      combine({
        ...initialReducers,
        ...reducers,
      })
    );
  });

  return store;
};

export default configureDynamicStore;
