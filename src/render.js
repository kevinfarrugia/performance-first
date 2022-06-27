/* eslint-disable import/no-import-module-exports */
import path from "path";

import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import * as React from "react";
import { renderToString } from "react-dom/server";
import Helmet from "react-helmet";
import { matchPath } from "react-router";
import { StaticRouter } from "react-router-dom/server";

import getRouteConfig from "./js/components/AppRouter/config";
import { selectRoutes } from "./js/components/AppRouter/selectors";
import getRoutesSSR from "./js/components/AppRouter/server";
import Scripts from "./js/components/Scripts";
import initialReducers from "./js/reducers";
import configureDynamicStore from "./js/store";

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
        path: route.path,
      },
      pathname
    );

    if (match) {
      const { fetchData } = getRouteConfig(route.name);

      if (fetchData) {
        // add the promise to fetch the route data
        fetchData.forEach((fn) => {
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

const handleRender = async (req, res, next) => {
  try {
    const serverChunkExtractor = new ChunkExtractor({
      statsFile: path.resolve(__dirname, "./server-stats.json"),
      entrypoints: ["server"],
    });
    const { Main } = serverChunkExtractor.requireEntrypoint();

    const modernChunkExtractor = new ChunkExtractor({
      statsFile: path.resolve(__dirname, "./public/client-stats.json"),
      entrypoints: ["client"],
    });

    let legacyChunkExtractor;
    if (!module.hot) {
      legacyChunkExtractor = new ChunkExtractor({
        namespace: "legacy",
        statsFile: path.resolve(__dirname, "./public/legacy-stats.json"),
        entrypoints: ["client"],
      });
    }

    // override the default addChunk method to add the chunk to legacy and modern extractor
    const clientChunkExtractor = {
      addChunk(chunk) {
        modernChunkExtractor.addChunk(chunk);
        if (legacyChunkExtractor) {
          legacyChunkExtractor.addChunk(chunk);
        }
      },
    };

    // create a new Redux store instance and clear all dynamic reducers
    const store = configureDynamicStore(
      {},
      true,
      initialReducers,
      process.env.NODE_ENV !== "production"
    );

    await getRoutesSSR(store);
    const routes = selectRoutes(store.getState());

    await renderRoutesData({
      path: req.path,
      url: req.url,
      query: req.query,
      routes,
      store,
    });

    const html = renderToString(
      <ChunkExtractorManager extractor={clientChunkExtractor}>
        <StaticRouter location={req.url}>
          <Main store={store} routes={routes} />
        </StaticRouter>
      </ChunkExtractorManager>
    );

    const scriptElements = modernChunkExtractor.getScriptElements();

    let legacyScriptElements;
    if (legacyChunkExtractor) {
      legacyScriptElements = legacyChunkExtractor.getScriptElements();
    }

    const scripts = renderToString(
      <Scripts scripts={scriptElements} legacyScripts={legacyScriptElements} />
    );

    let inlineCss = "";
    let css = "";

    if (!module.hot) {
      inlineCss = await modernChunkExtractor.getCssString();
    } else {
      css = modernChunkExtractor.getStyleTags();
    }
    const helmet = Helmet.renderStatic();

    // Grab the state from our Redux store
    const preloadedState = store.getState();

    // Send the rendered page back to the client using the server's view engine
    res.render("index", {
      htmlattributes: helmet.htmlAttributes.toString() || "",
      bodyattributes: helmet.bodyAttributes.toString() || "",
      title: `${helmet.title}`,
      head: `${helmet.meta} ${helmet.link}`,
      html,
      inlineCss,
      css,
      scripts,
      preloadedState: JSON.stringify(preloadedState),
    });
  } catch (err) {
    next(err);
  }
};

export default handleRender;
