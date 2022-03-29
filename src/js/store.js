/**
 * Create the store with dynamic reducers
 * Based on: https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application
 */

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { createReducer } from "./reducers";
import reducerRegistry from "./util/reducerRegistry";

const configureStore = (initialState = {}) => {
  const store = createStore(
    createReducer({ initialState }),
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );

  // replace the store's reducer whenever a new reducer is registered.
  reducerRegistry.setChangeListener((reducers) => {
    store.replaceReducer(createReducer({ reducers }));
  });

  return store;
};

export default configureStore;
