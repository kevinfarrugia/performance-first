import * as React from "react";

import Header from "../Header";
import Meta from "../Meta";

function Layout({ meta, path, children }) {
  return (
    <>
      <Meta
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        path={path}
        image={meta.image}
      />
      <Header />
      <main>{children}</main>
    </>
  );
}

export default Layout;
