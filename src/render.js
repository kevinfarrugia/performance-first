/*
 * Render React application middleware
 */
import React from "react";
import { renderToString } from "react-dom/server";
import Helmet from "react-helmet";

import App from "./js/components/app";

const handleRender = (req, res) => {
  const html = renderToString(<App />);

  const helmet = Helmet.renderStatic();

  // Send the rendered page back to the client using the server's view engine
  res.render("index", {
    htmlAttributes: helmet.htmlAttributes,
    bodyAttributes: helmet.bodyAttributes,
    head: `${helmet.title} ${helmet.meta} ${helmet.link}`,
    html,
  });
};

export default handleRender;
