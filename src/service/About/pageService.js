import page from "./page.json";

// Fetch from a local configuration
const getPage = () => Promise.resolve(page);

// Fetch from an external API
// const getPage = async ({ url }) => {
//   const res = await fetch(`${process.env.CMS_URL}/pages/?url=${url}`);
//   if (res.ok) {
//     return res.json();
//   }
//   throw new Error(res.statusText);
// };

// eslint-disable-next-line import/prefer-default-export
export { getPage };
