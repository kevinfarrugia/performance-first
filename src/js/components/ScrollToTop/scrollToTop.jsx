import * as React from "react";
import { useLocation } from "react-router";

function ScrollToTop() {
  const location = useLocation();

  React.useEffect(() => {
    if (location) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

export default ScrollToTop;
