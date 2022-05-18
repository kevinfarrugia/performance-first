import { fetchRoutes } from "./actions";

const getRoutesSSR = (store) => store.dispatch(fetchRoutes());

export default getRoutesSSR;
