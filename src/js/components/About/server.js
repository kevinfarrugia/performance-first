import reducerRegistry from "../../reducerRegistry";
import { REDUCER_NAME } from "./constants";
import reducer, { getAboutPage } from "./slice";

const getAboutSSR = (store, { path }) => {
  reducerRegistry.register(REDUCER_NAME, reducer);

  return store.dispatch(
    getAboutPage({
      path,
    })
  );
};

export default getAboutSSR;
