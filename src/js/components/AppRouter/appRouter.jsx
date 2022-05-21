import * as React from "react";
import { Route, Routes } from "react-router";

import getRouteConfig from "./config";

function AppRouter({ routes }) {
  return (
    <Routes>
      {routes.map((route) => {
        const { Component } = getRouteConfig(route.name);
        return (
          <Route key={route.path} path={route.path} element={<Component />} />
        );
      })}
    </Routes>
  );
}

export default AppRouter;
