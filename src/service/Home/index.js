import { toHome } from "./adapter";
import { getPage } from "./pageService";

const fetchHome = async (data) => {
  const res = await getPage(data);

  if (res.ok) {
    const response = await res.json();
    return toHome(response);
  }

  throw new Error(`${res.statusText}: ${res.url}`);
};

// eslint-disable-next-line import/prefer-default-export
export { fetchHome };
