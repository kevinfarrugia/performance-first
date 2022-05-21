import { getHomePage } from "./actions";

const getHomeSSR = (store, { path }) =>
  store.dispatch(
    getHomePage({
      path,
    })
  );

export default getHomeSSR;
