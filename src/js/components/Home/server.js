import reducerRegistry from "../../reducerRegistry";
import { getHomePage } from "./actions";
import { REDUCER_NAME } from "./constants";
import { reducer } from "./reducer";

const getHomeSSR = (store, { path }) => {
  reducerRegistry.register(REDUCER_NAME, reducer);

  return store.dispatch(
    getHomePage({
      path,
    })
  );
};

export default getHomeSSR;
