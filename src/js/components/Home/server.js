import { getHomePage } from "./slice";

const getHomeSSR = (store, { path }) =>
  store.dispatch(
    getHomePage({
      path,
    })
  );

export default getHomeSSR;
