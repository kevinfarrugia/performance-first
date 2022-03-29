import About, { getAboutSSR } from "../About";
import Home, { getHomeSSR } from "../Home";

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
