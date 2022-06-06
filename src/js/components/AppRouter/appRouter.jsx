import * as React from "react";
import { Route, Routes } from "react-router";

import getRouteConfig from "./config";

function AppRouter({ routes }) {
  return (
    <Routes>
      {routes.map((route) => {
        const { Component, Fallback } = getRouteConfig(route.name);
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Component fallback={Fallback ? <Fallback /> : undefined} />
            }
          />
        );
      })}
    </Routes>
  );
}

export default AppRouter;
