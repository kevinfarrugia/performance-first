/* eslint-disable import/no-import-module-exports */

import path from "path";

import { ChunkExtractor } from "@loadable/server";
import * as React from "react";
import { renderToString } from "react-dom/server";
import Helmet from "react-helmet";
import { matchPath } from "react-router";
import { StaticRouter } from "react-router-dom/server";

import getRouteConfig from "./js/components/AppRouter/config";
import getRoutesSSR from "./js/components/AppRouter/server";
import configureStore from "./js/store";

const renderRoutesData = async ({
  path: pathname,
  url,
  query,
  routes,
  store,
}) => {
  // retrieve data for all components on the current route
  const promises = [];

  // iterate through the routes and prepare fetchData and reducers
  routes.every((route) => {
    const match = matchPath(
      {
        path: route.url,
      },
      pathname
    );

    if (match) {
      const routeComponent = getRouteConfig(route.name);

      if (routeComponent) {
        // add the promise to fetch the route data
        routeComponent.fetchData.forEach((fn) => {
          promises.push(
            fn(store, {
              path: pathname,
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
  const serverStatsFile = path.resolve(__dirname, "./loadable-stats.json");
  const serverChunkExtractor = new ChunkExtractor({
    statsFile: serverStatsFile,
    entrypoints: ["server"],
  });
  const { Main } = serverChunkExtractor.requireEntrypoint();

  const clientStatsFile = path.resolve(
    __dirname,
    "./public/loadable-stats.json"
  );
  const clientChunkExtractor = new ChunkExtractor({
    statsFile: clientStatsFile,
    entrypoints: ["client"],
  });

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

  const jsx = clientChunkExtractor.collectChunks(
    <StaticRouter location={req.url}>
      <Main store={store} routes={routes} />
    </StaticRouter>
  );

  // Grab the state from our Redux store
  const preloadedState = store.getState();

  const html = renderToString(jsx);

  const scripts = clientChunkExtractor.getScriptTags();

  let inlineCss = "";
  let css = "";

  if (!module.hot) {
    inlineCss = await clientChunkExtractor.getCssString();
  } else {
    css = clientChunkExtractor.getStyleTags();
  }
  const helmet = Helmet.renderStatic();

  // Send the rendered page back to the client using the server's view engine
  res.render("index", {
    htmlattributes: helmet.htmlAttributes.toString() || "",
    bodyattributes: helmet.bodyAttributes.toString() || "",
    head: `${helmet.title} ${helmet.meta} ${helmet.link}`,
    html,
    inlineCss,
    css,
    scripts,
    preloadedState: JSON.stringify(preloadedState),
  });
};

export default handleRender;
