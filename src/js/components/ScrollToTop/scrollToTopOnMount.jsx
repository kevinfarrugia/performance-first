import * as React from "react";

function ScrollToTopOnMount() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}

export default ScrollToTopOnMount;
