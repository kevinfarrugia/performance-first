import page from "./page.json";

const getPage = ({ path }) =>
  Promise.resolve(page.find((n) => n.path === path));

// eslint-disable-next-line import/prefer-default-export
export { getPage };
