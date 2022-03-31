import page from "./page.json";

const getPage = () => Promise.resolve(page);

// const getPage = async ({ url }) => {
//   const res = await fetch(`${CMS_URL}/pages/?url=${url}`);
//   if (res.ok) {
//     return res.json();
//   }
//   throw new Error(res.statusText);
// };

// eslint-disable-next-line import/prefer-default-export
export { getPage };
