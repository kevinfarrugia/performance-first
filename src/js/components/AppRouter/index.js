import { fetchRoutes } from "./actions";
import AppRouter from "./appRouter";
import RoutesReducer, { selectRoutes } from "./reducer";

export const getRoutesSSR = (store) => store.dispatch(fetchRoutes());

export default AppRouter;

export { RoutesReducer, selectRoutes };
