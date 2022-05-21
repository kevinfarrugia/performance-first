import page from "./page.json";

// fetch from an internal file
const getPage = () => Promise.resolve(page);

// fetch from an external API endpoint
// const getPage = async ({ url }) => {
//   const res = await fetch(`${CMS_URL}/pages/?url=${url}`);
//   if (res.ok) {
//     return res.json();
//   }
//   throw new Error(res.statusText);
// };

// eslint-disable-next-line import/prefer-default-export
export { getPage };
