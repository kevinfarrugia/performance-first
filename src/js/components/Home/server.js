import { getHomePage } from "./actions";

const getHomeSSR = (store, { url }) =>
  store.dispatch(
    getHomePage({
      url,
    })
  );

export default getHomeSSR;
