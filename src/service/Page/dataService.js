const getSponsors = async () => {
  const res = await fetch(`${CMS_URL}/api/sponsors`);
  if (res.ok) {
    return res.json();
  }
  throw new Error(`${res.statusText}: ${res.url}`);
};

// eslint-disable-next-line import/prefer-default-export
export { getSponsors };
