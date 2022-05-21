import * as React from "react";
import { Helmet } from "react-helmet";

import defaultImage from "./img/defaultImage.png";

function Meta({ title, description, keywords, path, image }) {
  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="icon" type="image/png" href={image || defaultImage} />
      <link rel="canonical" content={path} />
      {/* Facebook Meta */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={path} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={image || defaultImage} />
      {/* Twitter Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@maltafa1900" />
      <meta name="twitter:creator" content="@maltafa1900" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}

export default Meta;
