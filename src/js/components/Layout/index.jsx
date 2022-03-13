import React from "react";

import Meta from "../Meta";

function Layout({ meta, children }) {
  return (
    <>
      <Meta
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
      />
      <main>{React.Children.only(children)}</main>
    </>
  );
}

export default Layout;
