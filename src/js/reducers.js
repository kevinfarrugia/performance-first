/* Reducers available by default */
import App from "./components/App/slice";
import AppRouter from "./components/AppRouter/slice";
import Page from "./components/Page/slice";

const initialReducers = {
  app: App,
  routes: AppRouter,
  page: Page,
};

export default initialReducers;
