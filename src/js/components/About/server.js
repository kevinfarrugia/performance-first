import { getAboutPage } from "./actions";

const getAboutSSR = (store, { url }) =>
  store.dispatch(
    getAboutPage({
      url,
    })
  );

export default getAboutSSR;
