/*
 * Render React application middleware
 */
import * as React from "react";
import { renderToString } from "react-dom/server";
import Helmet from "react-helmet";
import { matchPath } from "react-router";
import { StaticRouter } from "react-router-dom/server";

import App from "./js/components/App";
import AppRouter, { getRoutesSSR } from "./js/components/AppRouter";
import getRouteConfig from "./js/components/AppRouter/config";
import configureStore from "./js/store";

const renderRoutesData = async ({ path, url, query, routes, store }) => {
  // retrieve data for all components on the current route
  const promises = [];

  // iterate through the routes and prepare fetchData and reducers
  routes.every((route) => {
    const match = matchPath(
      {
        path: route.url,
      },
      path
    );

    if (match) {
      const routeComponent = getRouteConfig(route.name);

      if (routeComponent) {
        // add the promise to fetch the route data
        routeComponent.fetchData.forEach((fn) => {
          promises.push(
            fn(store, {
              path,
              match,
              query,
              url,
              route,
            })
          );
        });
      }
    }

    return !match;
  });

  // wait for all promises to resolve
  await Promise.all(promises);
};

const handleRender = async (req, res) => {
  // Create a new Redux store instance
  const store = configureStore();

  const routes = await getRoutesSSR(store);

  await renderRoutesData({
    path: req.path,
    url: req.url,
    query: req.query,
    routes,
    store,
  });

  const html = renderToString(
    <StaticRouter location={req.url}>
      <App store={store}>
        <AppRouter routes={routes} />
      </App>
    </StaticRouter>
  );

  // Grab the initial state from our Redux store
  const preloadedState = store.getState();

  const helmet = Helmet.renderStatic();

  // Send the rendered page back to the client using the server's view engine
  res.render("index", {
    htmlattributes: helmet.htmlAttributes.toString() || "",
    bodyattributes: helmet.bodyAttributes.toString() || "",
    head: `${helmet.title} ${helmet.meta} ${helmet.link}`,
    html,
    preloadedState: JSON.stringify(preloadedState).replace(/</g, "\\u003c"),
  });
};

export default handleRender;
