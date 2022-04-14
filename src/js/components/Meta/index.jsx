import * as React from "react";
import { Helmet } from "react-helmet";

function Meta({ title, description, keywords }) {
  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
    </Helmet>
  );
}

export default Meta;
