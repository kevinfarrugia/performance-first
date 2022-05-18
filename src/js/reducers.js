/* Default reducers available by default */
import AppReducer from "./components/App/reducer";
import AppRouterReducer from "./components/AppRouter/reducer";

const staticReducers = {
  app: AppReducer,
  routes: AppRouterReducer,
};

export default staticReducers;
