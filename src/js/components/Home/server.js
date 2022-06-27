import reducerRegistry from "../../reducerRegistry";
import { REDUCER_NAME } from "./constants";
import reducer from "./slice";
import { getHomePage } from "./thunks";

const getHomeSSR = (store, { path }) => {
  reducerRegistry.register(REDUCER_NAME, reducer);

  return store.dispatch(
    getHomePage({
      path,
    })
  );
};

export default getHomeSSR;
