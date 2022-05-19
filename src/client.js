import { loadableReady } from "@loadable/component";
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { selectRoutes } from "./js/components/AppRouter";
import configureStore from "./js/store";
import Main from "./main";

// grab the state from a global variable injected into the server-generated HTML
// eslint-disable-next-line no-underscore-dangle
const store = configureStore(window.__PRELOADED_STATE__);

loadableReady(() => {
  const routes = selectRoutes(store.getState());
  ReactDOM.hydrate(
    <BrowserRouter>
      <Main routes={routes} store={store} />
    </BrowserRouter>,
    document.getElementById("root")
  );
});

if (process.env.NODE_ENV === "production") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.info("Successfully registered service worker", reg);
        })
        .catch((err) => {
          console.warn("Error whilst registering service worker", err);
        });
    });
  }
}
