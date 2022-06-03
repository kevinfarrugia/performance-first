import fetch from "node-fetch";

const getPage = async () =>
  fetch(
    new URL(
      `${CMS_URL}/kevinfarrugia/performance-first/main/api/Home/page.json`
    )
  );

// eslint-disable-next-line import/prefer-default-export
export { getPage };
