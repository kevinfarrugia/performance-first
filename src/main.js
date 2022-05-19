import * as React from "react";

import App from "./js/components/App";
import AppRouter from "./js/components/AppRouter";

function Main({ store, routes }) {
  return (
    <App store={store}>
      <AppRouter routes={routes} />
    </App>
  );
}

export default Main;
