import { getAboutPage } from "./actions";

const getAboutSSR = (store, { path }) => {
  store.dispatch(
    getAboutPage({
      path,
    })
  );
};

export default getAboutSSR;
