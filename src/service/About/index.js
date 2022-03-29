import { toAbout } from "./adapter";
import { getPage } from "./pageService";

const fetchAbout = (data) =>
  getPage(data)
    .then((response) => toAbout(response))
    .catch((error) => {
      console.error(error);
      throw error;
    });

// eslint-disable-next-line import/prefer-default-export
export { fetchAbout };
