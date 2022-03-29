// Removes the domain and TLD, returning just the path requested
// http://www.example.com/foo/bar becomes '/foo/bar'
const extractUrlPath = (url) => {
  let urlSections = url.split("/");
  urlSections = urlSections.filter((sectionString) => sectionString.length > 0);

  let urlPath = null;
  if (urlSections.length === 0) {
    urlPath = "/";
  } else {
    urlPath = `/${urlSections.join("/")}`;
  }
  return urlPath;
};

const toRoutes = (routes) => {
  if (routes) {
    return routes.map((n) => ({
      url: n.key,
      name: n.value.toLowerCase(),
    }));
  }

  return [];
};

export { toRoutes, extractUrlPath };
