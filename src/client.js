import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./js/components/App";
import AppRouter, { selectRoutes } from "./js/components/AppRouter";
import configureStore from "./js/store";

// grab the state from a global variable injected into the server-generated HTML
// eslint-disable-next-line no-underscore-dangle
const store = configureStore(window.__PRELOADED_STATE__);
const routes = selectRoutes(store.getState());

ReactDOM.hydrate(
  <BrowserRouter>
    <App store={store}>
      <AppRouter routes={routes} />
    </App>
  </BrowserRouter>,
  document.getElementById("root")
);

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
