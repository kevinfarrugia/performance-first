import en from "./en.json";

const get = () =>
  Promise.resolve({
    lang: "en",
    routes: en,
  });

// eslint-disable-next-line import/prefer-default-export
export { get };
