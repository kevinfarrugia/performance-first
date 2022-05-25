/* eslint-disable import/no-import-module-exports */

import path from "path";

import compression from "compression";
import cookieParser from "cookie-parser";
import * as express from "express";
import { create } from "express-handlebars";
import helmet from "helmet";
import PrettyError from "pretty-error";

import Main from "./main";
import handleRender from "./render";
import { isValidPath } from "./service/Router";

const app = express();
app.disable("x-powered-by");

// setup express to use handlebars as the templating engine
const hbs = create({
  defaultLayout: false,
  extname: ".hbs",
});

app.set("views", path.resolve(__dirname, "templates"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(helmet());

// https://helmetjs.github.io/
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: "'unsafe-inline'",
      connectSrc: ["'self'", CMS_URL],
      frameSrc: ["'self'"],
    },
  })
);

app.use(
  express.static(path.join(__dirname, "/public"), {
    maxAge: 31536000000, // in milliseconds
  })
);

app.use(
  "/fonts",
  express.static(path.join(__dirname, "/public/fonts"), {
    maxAge: 31536000000, // in milliseconds
  })
);

app.use("/", (req, res, next) => {
  res.set("Cache-Control", "no-cache");
  next();
});

app.use(compression());

app.use(cookieParser());

// path validation middleware (could be connected to an API)
app.use(async (req, _res, next) => {
  const isValid = await isValidPath(req.path);
  if (isValid) {
    return next();
  }

  // return a 404 status
  const error = new Error(`${req.path} not found`);
  error.status = 404;
  return next(error);
});

// middleware to render server side HTML
app.use(handleRender);

const prettyError = new PrettyError();
prettyError.skipNodeFiles();
prettyError.skipPackage("express");

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(prettyError.render(err));
  res.status(err.status || 500);
  res.render("500", {
    html: err,
  });
});

if (!module.hot) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.info(`The server is running at http://localhost:${port}/`);
  });
}

if (module.hot) {
  app.hot = module.hot;
}

export default app;

// re-export Main to be consumed by loadable-components's ChunkExtractor
export { Main };
