import React from "react";

import Meta from "../meta";

const Layout = ({ meta, children }) => {
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
};

export default Layout;
