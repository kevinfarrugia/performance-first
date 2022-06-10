const toRoutes = (routes) => {
  if (routes) {
    return routes.map((n) => ({
      path: n.key,
      name: n.value.toLowerCase(),
    }));
  }

  return [];
};

// eslint-disable-next-line import/prefer-default-export
export { toRoutes };
