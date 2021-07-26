/*
 * Render React application middleware
 */
import React from "react";
import { renderToString } from "react-dom/server";
import Helmet from "react-helmet";

import App from "./js/components/App";

const handleRender = (req, res) => {
  const html = renderToString(<App />);

  const helmet = Helmet.renderStatic();

  // Send the rendered page back to the client using the server's view engine
  res.render("index", {
    htmlattributes: helmet.htmlAttributes.toString() || "",
    bodyattributes: helmet.bodyAttributes.toString() || "",
    head: `${helmet.title} ${helmet.meta} ${helmet.link}`,
    html,
  });
};

export default handleRender;
