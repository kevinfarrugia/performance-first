import About from "../About";
import Home from "../Home";

const getRouteConfig = (name) => {
  switch (name) {
    case "home":
      return {
        Component: Home,
        fetchData: [],
      };
    case "about":
      return {
        Component: About,
        fetchData: [],
      };
    default:
      console.error(`Route ${name} does not have a component.`);
      return {
        Component: null,
        fetchData: [],
      };
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getRouteConfig };
