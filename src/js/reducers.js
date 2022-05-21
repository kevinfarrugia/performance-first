/* Reducers available by default */
import AppReducer from "./components/App/reducer";
import AppRouterReducer from "./components/AppRouter/reducer";
import PageReducer from "./components/Page/reducer";

const staticReducers = {
  app: AppReducer,
  routes: AppRouterReducer,
  page: PageReducer,
};

export default staticReducers;
