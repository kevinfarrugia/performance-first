import { getRoutes } from "./thunks";

const getRoutesSSR = (store) => store.dispatch(getRoutes());

export default getRoutesSSR;
