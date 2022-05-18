import * as React from "react";
import { StaticRouter } from "react-router-dom/server";

import App from "./js/components/App";
import AppRouter from "./js/components/AppRouter";

function Main({ url, store, routes }) {
  return (
    <StaticRouter location={url}>
      <App store={store}>
        <AppRouter routes={routes} />
      </App>
    </StaticRouter>
  );
}

export default Main;
