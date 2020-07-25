import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet htmlAttributes={{ lang: "en" }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta charset="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#fff" />
      <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
      <link rel="icon" sizes="192x192" href="/icon.png" />
      <link rel="apple-touch-icon" href="/icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta property="og:image" content="/img/logo.jpg" />
      <link rel="image_src" href="/img/logo.jpg" />
    </Helmet>
  );
};

export default Meta;
