import loadable from "@loadable/component";

import reducerRegistry from "../../reducerRegistry";
import { REDUCER_NAME as ABOUT_REDUCER_NAME } from "../About/constants";
import getAboutSSR from "../About/server";
import aboutReducer from "../About/slice";
import getDefaultPageSSR from "../DefaultPage/server";
import DefaultPageSkeleton from "../DefaultPageSkeleton";
import { REDUCER_NAME as HOME_REDUCER_NAME } from "../Home/constants";
import getHomeSSR from "../Home/server";
import homeReducer from "../Home/slice";

const Home = loadable(() => import("../Home"));
const About = loadable(() => import("../About"));
const DefaultPage = loadable(() => import("../DefaultPage"));

function Empty() {
  return null;
}

const getRouteConfig = (name) => {
  switch (name) {
    case "home":
      return {
        Component: Home,
        fetchData: [getHomeSSR],
        registerReducers: () =>
          reducerRegistry.register(HOME_REDUCER_NAME, homeReducer),
      };
    case "about":
      return {
        Component: About,
        fetchData: [getAboutSSR],
        registerReducers: () =>
          reducerRegistry.register(ABOUT_REDUCER_NAME, aboutReducer),
      };
    case "defaultpage":
      return {
        Component: DefaultPage,
        Fallback: DefaultPageSkeleton,
        fetchData: [getDefaultPageSSR],
      };
    default:
      // return a 404 page
      console.error(`Route ${name} does not have a component.`);
      return {
        Component: Empty,
      };
  }
};

export default getRouteConfig;
