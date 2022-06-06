import * as React from "react";

import App from "../App";
import AppRouter from "../AppRouter";

function Main({ store, routes }) {
  return (
    <App store={store}>
      <AppRouter routes={routes} />
    </App>
  );
}

export default Main;
