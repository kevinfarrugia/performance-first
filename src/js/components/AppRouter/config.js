import loadable from "@loadable/component";

import { getAboutSSR } from "../About";
import { getHomeSSR } from "../Home";

const Home = loadable(() => import("../Home"));
const About = loadable(() => import("../About"));

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
    default:
      console.error(`Route ${name} does not have a component.`);
      return {
        Component: null,
        fetchData: [],
      };
  }
};

export default getRouteConfig;
