import { createSelector } from "@reduxjs/toolkit";

import { REDUCER_NAME } from "./constants";

const getState = (state) => state[REDUCER_NAME];

export const selectIsLoading = createSelector(getState, (n) => n.isLoading);

export const selectIsError = createSelector(getState, (n) => n.isError);

export const selectIsBoundaryError = createSelector(
  getState,
  (n) => n.isBoundaryError
);

export const selectDeferredPrompt = createSelector(
  getState,
  (n) => n.deferredPrompt
);

export const selectMeta = createSelector(getState, (n) => n.meta);

export const selectPath = createSelector(getState, (n) => n.path);
