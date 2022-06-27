import { createSelector } from "@reduxjs/toolkit";

import { REDUCER_NAME } from "./constants";

const getState = (state) => state[REDUCER_NAME];

export const selectIsReady = createSelector(getState, (n) => n.isReady);

export const selectAbout = createSelector(getState, (n) => ({
  // extend the default page with custom selectors for this reducer
  date: n.date && new Date(n.date).toLocaleDateString(),
}));
