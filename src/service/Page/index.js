import { toPage } from "./adapter";
import { getPage } from "./pageService";

const fetchPage = async (data) => {
  const res = await getPage(data);

  if (res.ok) {
    const response = await res.json();
    return toPage(response);
  }

  throw new Error(res.statusText);
};

// eslint-disable-next-line import/prefer-default-export
export { fetchPage };
