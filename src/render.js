import path from "path";

import { ChunkExtractor } from "@loadable/server";
/*
 * Render React application middleware
 */
import * as React from "react";
import { renderToString } from "react-dom/server";
import Helmet from "react-helmet";
import { matchPath } from "react-router";

import getRouteConfig from "./js/components/AppRouter/config";
import getRoutesSSR from "./js/components/AppRouter/server";
import configureStore from "./js/store";

// import Main from "./main";

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
    <Main url={req.url} store={store} routes={routes} />
  );

  const html = renderToString(jsx);

  const inlineCss = await serverChunkExtractor.getCssString();
  const css = clientChunkExtractor.getStyleTags();
  const scripts = clientChunkExtractor.getScriptTags();
  // eslint-disable-next-line no-console
  console.log({
    client: JSON.stringify(clientChunkExtractor.getStyleElements()),
    server: JSON.stringify(serverChunkExtractor.getStyleElements()),
  });

  // Grab the initial state from our Redux store
  const preloadedState = store.getState();

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
    preloadedState: JSON.stringify(preloadedState).replace(/</g, "\\u003c"),
  });
};

export default handleRender;
