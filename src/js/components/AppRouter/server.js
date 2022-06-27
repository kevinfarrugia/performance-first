import { getRoutes } from "./slice";

const getRoutesSSR = (store) => store.dispatch(getRoutes());

export default getRoutesSSR;
