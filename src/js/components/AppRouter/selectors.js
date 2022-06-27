/* eslint-disable import/prefer-default-export */
import { createSelector } from "@reduxjs/toolkit";

import { REDUCER_NAME } from "./constants";

const getState = (state) => state[REDUCER_NAME];

const selectRoutes = createSelector(getState, (n) => n.routes);

export { selectRoutes };
