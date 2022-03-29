import { toPage } from "../adapter";

/* extend the default page with custom properties for this page */
const toAbout = (data) => {
  if (data) {
    return {
      ...toPage(data),
    };
  }
  return null;
};

// eslint-disable-next-line import/prefer-default-export
export { toAbout };
