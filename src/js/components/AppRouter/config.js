import loadable from "@loadable/component";

import getAboutSSR from "../About/server";
import getDefaultPageSSR from "../DefaultPage/server";
import DefaultPageSkeleton from "../DefaultPageSkeleton";
import getHomeSSR from "../Home/server";

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
      };
    case "about":
      return {
        Component: About,
        fetchData: [getAboutSSR],
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
