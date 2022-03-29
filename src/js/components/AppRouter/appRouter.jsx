import * as React from "react";
import { Route, Routes } from "react-router";

import { getRouteConfig } from "./config";

function AppRouter({ routes }) {
  return (
    <Routes>
      {routes.map((route) => {
        // eslint-disable-next-line no-unused-vars
        const { Component } = getRouteConfig(route.name);
        // eslint-disable-next-line no-console
        return (
          <Route key={route.url} path={route.url} element={<Component />} />
        );
      })}
    </Routes>
  );
}

export default AppRouter;
