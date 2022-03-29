const isDebug = () => {
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.has("debug");
  }

  return false;
};

export default isDebug;
