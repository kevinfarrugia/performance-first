import reducerRegistry from "../../reducerRegistry";
import { getAboutPage } from "./actions";
import { REDUCER_NAME } from "./constants";
import reducer from "./reducer";

const getAboutSSR = (store, { path }) => {
  reducerRegistry.register(REDUCER_NAME, reducer);

  return store.dispatch(
    getAboutPage({
      path,
    })
  );
};

export default getAboutSSR;
