import { toHome } from "./adapter";
import { getPage } from "./pageService";

const fetchHome = (data) =>
  getPage(data)
    .then((response) => toHome(response))
    .catch((error) => {
      console.error(error);
      throw error;
    });

// eslint-disable-next-line import/prefer-default-export
export { fetchHome };
