import { toPage } from "./adapter";
import { getPage } from "./pageService";

const fetchPage = (data) =>
  getPage(data)
    .then((response) => toPage(response))
    .catch((error) => {
      throw error;
    });

// eslint-disable-next-line import/prefer-default-export
export { fetchPage };
