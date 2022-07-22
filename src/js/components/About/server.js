import { getAboutPage } from "./slice";

const getAboutSSR = (store, { path }) =>
  store.dispatch(
    getAboutPage({
      path,
    })
  );

export default getAboutSSR;
