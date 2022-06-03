import fetch from "node-fetch";

const getPage = async ({ path }) =>
  fetch(
    new URL(
      `${CMS_URL}/kevinfarrugia/performance-first/main/api/Page${path}.json`
    )
  );

// eslint-disable-next-line import/prefer-default-export
export { getPage };
