import { createSelector } from "@reduxjs/toolkit";

import { REDUCER_NAME } from "./constants";

const getState = (state) => state[REDUCER_NAME];

const selectIsReady = (state, { path }) => getState(state).isReady[path];

export const makeSelectIsReady = () => createSelector(selectIsReady, (n) => n);

const selectPage = (state, { path }) => getState(state).page[path];

export const makeSelectPage = () => createSelector(selectPage, (n) => n);
