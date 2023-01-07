[![Build](https://github.com/kevinfarrugia/performance-first/actions/workflows/build.yml/badge.svg)](https://github.com/kevinfarrugia/performance-first/actions/workflows/build.yml)

# Performance-First template

Performance-First template is a template for server-side rendering React web apps prioritizing performance best practices. The template includes [critical CSS](https://imkev.dev/inlining-critical-css), [module/nomodule](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/), code-splitting, service workers, server-side rendering, partial hydration, [granular chunking](https://web.dev/granular-chunking-nextjs/), resource hints, CSS modules, [async CSS](https://www.filamentgroup.com/lab/load-css-simpler/), and much more.

[View Demo](https://performance-first.herokuapp.com/)

## Technologies

- [Node.js](https://nodejs.org/)
- [Express](http://expressjs.com/)
- [React](https://facebook.github.io/react/)
- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Webpack v5](http://webpack.github.io/)
- [Babel](http://babeljs.io/)
- [Loadable Components](https://loadable-components.com/)
- [Workbox](https://developer.chrome.com/docs/workbox/)

## Scope

The goal of this project is to create a reference or starting point for a fast-performing website configuration using ReactJS. I will try to keep this updated with the latest findings and research. All feedback is welcome.

### [100 on Lighthouse for the home page](https://pagespeed.web.dev/report?url=https%3A%2F%2Fperformance-first.herokuapp.com%2F)

![lighthouse-score-home](https://user-images.githubusercontent.com/8075326/172028560-3443ad55-133e-4d15-8e59-c631c27cd64f.png)

### [100 on Lighthouse for a banner page](https://pagespeed.web.dev/report?url=https%3A%2F%2Fperformance-first.herokuapp.com%2Fpage-a)

![lighthouse-score-banner-page](https://user-images.githubusercontent.com/8075326/172028559-164cfabc-44a8-4158-9094-4cd06c5a34cc.png)

_Disclaimer: Lighthouse scores only serve as an indication of performance best practices, not your user's experience. Performance is much more complex than a simple 0-100 score. If you want to monitor performance properly, I recommend that you look at RUM tools such as [SpeedCurve](https://www.speedcurve.com/), [Akamai mPulse](https://www.akamai.com/products/mpulse-real-user-monitoring), or the [web-vitals](https://github.com/GoogleChrome/web-vitals) library._

## Getting Started

If you don't already have Node.js, download and install [Node.js](https://nodejs.org/en/) >= 16.

### Quick Start

1. Install all dependencies and developer tools as listed in package.json:

```
npm install
```

2. Bundle & run the application in development mode

```
npm start
```

## Adding a new route

Performance-First template allows you to add routes dynamically or statically. A dynamic route is added through an external service, such as an API; while a static route is declared directly in the codebase, usually in the form of a JSON file.

### Router service

The default [Router](./src/service/Router/router.js) included in the template retrieves the routes from [en.json](./src/service/Router/en.json). It is responsible for caching routes using a _stale-while-revalidate_ strategy and checking if a given route is valid.

```json
[
  {
    "key": "/",
    "value": "home"
  },
  {
    "key": "/about",
    "value": "about"
  },
  {
    "key": "/:path",
    "value": "defaultpage"
  }
]
```

The `en.json` file contains three different types of routes and a corresponding path for each one. The `home` and `about` route use exact URLs, while the `defaultpage` supports a wildcard `:path`. The more specific routes should be declared at the top of the file, while the more generic ones should be placed at the bottom.

```
const toRoutes = (routes) => {
  if (routes) {
    return routes.map((n) => ({
      path: n.key,
      name: n.value.toLowerCase(),
    }));
  }

  return [];
};
```

The `en.json` file is then transformed using [adapter.js](./src/service/Router/adapter.js) to create an array of Route objects that are understood by our router. This means that you could plug the Performance-First template into any API by changing the `toRoutes` method to match your API's response.

### react-router

Routing is configured using [`react-router`](https://github.com/remix-run/react-router) v6 on both the client and server-side.

### DefaultPage

Adding a default page requires zero-config. The route will be picked up by the `/:path` wildcard, assigning it a value of `defaultpage`. This will render the [`DefaultPage`](./src/js/components/DefaultPage/) component which renders the page's content and updates the `<meta>` elements.

```js
const getPage = async ({ path }) =>
  fetch(
    new URL(
      `${CMS_URL}/api/Page/${path}`
    )
  );
```

The application makes a request to `getPage` using the `path` as an argument. The `getPage` should call your API endpoint which returns the page data while accepting the `path`. The template uses a mock API service by downloading the JSON files directly from GitHub.

```jsx
<Page path={pathname} onGetPage={getPage} scrollToTop>
  {({ page: { title, html, banner }, isReady: isPageReady }) => {
    {/* ... */}
  }}
</Page>
```

If the user is navigating to the page using a soft navigation, i.e. within the client-side router, then the [`<Page>`](./src/js/components/Page/) component is responsible for fetching and updating the Redux store.

#### Customizing the DefaultPage

You can fully customize the appearance & structure of the `DefaultPage` component by modifying the [`defaultPage`](./src/js/components/DefaultPage/defaultPage.jsx) component and the corresponding [`styles.scss`](./src/js/components/DefaultPage/styles.scss).

### Custom page

If you want to create a route that serves a custom page - meaning a page that has a different structure from the other pages - then you can create a new component and configure that page using the `AppRouter` [`config`](./src/js/components/AppRouter/config.js).

```js
const getRouteConfig = (name) => {
  switch (name) {
    case "home":
      return {
        Component: Home,
        fetchData: [getHomeSSR],
      };
    case "about":
      return {
        Component: About,
        fetchData: [getAboutSSR],
      };
    case "defaultpage":
      return {
        Component: DefaultPage,
        Fallback: DefaultPageSkeleton,
        fetchData: [getDefaultPageSSR],
      };
    case "blogpage":
      return {
        Component: BlogPage,
        fetchData: [getBlogPageSSR],
      };
  }
};
```

The `getRouteConfig` receives the `name` of the route as defined in the `toRoutes` adapter and returns an object containing the `Component` to render, the `Fallback` component until the `Component` is fetched (if using `loadable`) and a `fetchData` array.

#### fetchData

The `fetchData` array is a list of Promises which are executed and awaited when the route is requested from the server-side application.

As an example, if the user lands on the `"home"` route, the server will execute `getHomeSSR` and await it before rendering the HTML.

Each function in the `fetchData` array will receive the following arguments:

```js
fn(store, options)
```

The `store` refers to the Redux store while `options` include the following:

| Name  | Description                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------- |
| path  | The request path (e.g: `/home`).                                                                |
| match | The [`PathMatch`](https://reactrouter.com/docs/en/v6/utils/match-path) object for that request. |
| query | Query string params.                                                                            |
| url   | Request URL string. (e.g: `/home?a=b`).                                                         |
| route | The matching route as stored in the `AppRouter` reducer.                                        |

```js
const getHomeSSR = (store, { path }) =>
  store.dispatch(
    getHomePage({
      path,
    })
  );
```

This allows you to populate the Redux store with data for that specific route.

```js
case "mypage":
  return {
    Component: MyPage,
    fetchData: [getHeaderSSR, getNavigationMenuSSR, getBannerSSR, getMyPageSSR],
  };
```

As you are not limited to a single `fetchData` function, you may combine several requests that are needed to render a page.

```js
[
  {
    "key": "/",
    "value": "home"
  },
  {
    "key": "/about",
    "value": "about"
  },
  {
    "key": "blog/:path",
    "value": "blogpage"
  },
  {
    "key": "/:path",
    "value": "defaultpage"
  }
]
```

Similar to the `DefaultPage`, you can use a wildcard to serve a dynamic number of similar pages, such as the `blogpage` above.

## Scripts

| Flag          | Description                                                                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`       | Builds the project. Accepts `--release`, `--analyze` flags                                                                                                                                                            |
| `build-stats` | Build the project with production configuration and launches [Webpack Bundle Analyzer](https://github.com/th0r/webpack-bundle-analyzer)                                                                               |
| `serve`       | Runs the Express server and serves the output from the build folder                                                                                                                                                   |
| `start`       | Launches Webpack compiler in watch mode (via [webpack-middleware](https://github.com/kriasoft/webpack-middleware)) and runs the development server, including HMR and BrowserSync. Accepts `--release`, `--hot` flags |

### Arguments

To pass arguments to the NPM script, you are required to use double dashes, ex:

```
npm run build -- --release
```

## Deploying to production

For the production environment, you are expected to run the following scripts

```
npm run build -- --release --verbose
```

You should then navigate to the build output folder and run the server using `node` directly instead of through `npm`:

```
cd ./build
node server.js
```

### Docker

If you are using [Docker](https://www.docker.com/), the template includes a default [`Dockerfile`](./Dockerfile). The `Dockerfile` compiles and runs a production build on a lightweight [Alpine Linux](https://www.alpinelinux.org/) environment using Node 16.

## Folder Structure

```
.
├── .github/workflows          # GitHub actions
├── .husky/                    # Husky pre-commit hooks
├── api/                       # Mock API JSON service
├── build/                     # Compiled output
├── public/                    # Static files which are copied into the /build/public folder
├── scripts/                   # Build automation scripts and utilities
│   ├── lib/                   # Utilities for build scripts
│   ├── build.js               # Builds the project from source to output (build) folder
│   ├── bundle.js              # Bundles the web resources into package(s) through Webpack
│   ├── clean.js               # Cleans up the output (build) folder
│   ├── copy.js                # Copies static files to output (build) folder
│   ├── run.js                 # Helper function for running build automation tasks
│   ├── runServer.js           # Launches (or restarts) Node.js server
│   ├── start.js               # Launches the development web server with HMR
│   └── webpack.config.js      # Configurations for client-side and server-side bundles
├── src/                       # The source code of the application
│   ├── js/                    # JavaScript application code
│   │   ├── components         # React components
│   │   ├── hooks              # React hooks
│   │   ├── util               # Utilities & helper functions
│   │   ├── reducerRegistry.js # ReducerRegistry class definition
│   │   ├── reducers.js        # Globally available reducers
│   │   ├── store.js           # Store configuration and overrides to connect ReducerRegistry
│   ├── scss/                  # Global SCSS files & fonts
│   ├── service/               # Mock service-layer & API integrations
│   ├── templates/             # Handlebar templates used to render HTML content in Express
│   ├── client.js              # Entry point for client-side bundle
│   ├── main.js                # The entry point for the application. This is imported by both client.js and server.js
│   ├── polyfills.js           # The entry point for the legacy bundle.
│   ├── render.js              # Handles SSR for React application
│   ├── server.js              # Entry point for server-side bundle
│   ├── sw.js                  # Service Worker used by WorkboxPlugin.InjectManifest
├── babel.config.js            # @babel/eslint-parser configuration file
├── Dockerfile                 # Commands for building a Docker image for production
├── package.json               # The list of 3rd party libraries and utilities
└── package-lock.json          # Fixed versions of all the dependencies
└── postcss.config.js          # PostCSS plugins & options
```

### Naming Conventions

The naming conventions that are followed throughout the template:

- Folders begin with an uppercase letter.
- Files begin with a lowercase letter.
- Folders contain an `index.js` file that exports the functions and components for that module.

## Hot Module Reloading

The project allows for Hot Module Reloading using `webpack-hot-middleware`. This enables HMR for JSX, S/CSS, and NodeJS.

## Loadable Components

[Loadable Components](https://loadable-components.com/) are the de-facto standard for lazy loading on an SSR React application. Loadable Components reads the stats files generated by Webpack and `@loadable/webpack-plugin` to split your bundle into sizeable chunks.

The Performance-First template uses component-based code-splitting by default, however, you may override this by using `webpackChunkName`.

```js
import(/* webpackChunkName: "commonFeature" */ './featureA')
import(/* webpackChunkName: "commonFeature" */ './featureB')
import(/* webpackChunkName: "featureC" */ './featureC')
```

The above example will result in two chunks, one containing `./featureA` and `./featureB` and the other containing `./featureC`.

## Critical CSS

Critical or inline CSS is determined using `loadable-components`. The CSS required to render all the components on the server route is automatically inlined in the `<head>`.

While using HMR (`npm run start`), inlined CSS is disabled as `mini-css-extract-plugin` does not support HMR on the server.

Read more about [inlining critical CSS](https://imkev.dev/inlining-critical-css) and its performance benefits.

## ReducerRegistry

The [ReducerRegistry](./src/js/reducerRegistry.js) is a singleton class that exposes a `register` method, allowing consumers to dynamically attach reducers to the store and improve code-splitting.

```js
import reducerRegistry from "../../reducerRegistry";

reducerRegistry.register(REDUCER_NAME, reducer);
```

The `register` method may be called using the above syntax and should be called before calling any actions for that reducer, including server-side requests. As a rule-of-thumb, I recommend placing it in the `reducer.js` file and the `fetchData` SSR methods for server-side requests.

The [`configureDynamicStore`](./src/js/store.js#L:18) function combines the Redux Toolkit's `configureDynamicStore` with a change listener to automatically update the reducers in the store.

The store is configured on both the server application and the client application. The server does not have an initial state and should reset all reducers between requests, while the client will use the `window.__PRELOADED_STATE__` as the initial state.

_Tip: If you find yourself registering multiple reducers in the same component (i.e. calling `reducerRegistry.register` more than once in the same component), then most likely you would benefit from separating the component into two smaller components._

## Templates

Performance-First template generates all HTML using the server-side rendered data by passing it to the HTML through Handlebars templates.

| Name           | Description                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| htmlattributes | Attributes to be appended to the `<html>`. tag                                                                                                                                  |
| inlineCss      | Critical CSS added to the `<head>`.                                                                                                                                             |
| css            | `<link>` elements for CSS stylesheets added to the `<head>`.                                                                                                                    |
| head           | Any additional elements to be added to the end of the `<head>` tag. By default, these are generated using `react-helmet` and include `<title>`, `<meta>` and `<link>` elements. |
| bodyattributes | Attributes to be appended to the `<body>`                                                                                                                                       |
| html           | HTML content for the current route.                                                                                                                                             |
| scripts        | `<script>` elements added to the end of the `<body>`.                                                                                                                           |
| preloadedState | Redux `state` to be hydrated by the client-side.                                                                                                                                |

## Module / nomodule

Script elements use the [`module` / `nomodule` pattern](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/) to serve modern JavaScript to modern devices while not compromising legacy browsers.

```jsx
const scripts = renderToString(
  <Scripts scripts={scriptElements} legacyScripts={legacyScriptElements} />
);
```

The HTML for the scripts is generated using the `<Scripts>` component, which receives `scripts` and `legacyScripts`.

```js
<script type="module" src="/webpack.mjs"></script>
<script type="module" src="/client.mjs"></script>
<script type="module" src="/Home.mjs"></script>
<script type="nomodule" src="/webpack.js" defer></script>
<script type="nomodule" src="/client.js" defer></script>
<script type="nomodule" src="/Home.js" defer></script>
```

The output HTML should include both `.mjs` and `.js` files. A modern browser will only download the `.mjs` files, while a legacy browser would only download the `.js` files.

## State Management

[Redux](https://redux.js.org/) is a state container used together with React. The template uses [Redux Toolkit](https://redux-toolkit.js.org/) and follows the standards and practices documented by Redux Toolkit.

## Suggested guidelines

Below are some recommendations I like to follow when working on a website. These may not all apply equally to every project, so I use them as guidelines and then test to see how they perform.

### Fonts

- Font files are preloaded. Only preload the `woff2` and a maximum of two font files - usually bold and normal.
- Prefer `font-display:swap`. This may cause a FOUT (flash of unstyled text). If unsightly, remove (defaults to `auto`).
- Use [glyphhanger](https://github.com/zachleat/glyphhanger) to subset your fonts and remove unused glyphs. May result in 50% smaller font files.

### `cache-control` headers

- Use a CDN.
- Cache static assets (images, scripts, stylesheets) for one year and use a content hash.
- [Cache the HTML page](https://imkev.dev/cache-control#caching-the-html-page) responsibly.

### Images

- Optimize images using [Squoosh](https://squoosh.app) or Squoosh CLI.
- Use the `picture` element with `srcset`, `sizes` and `media`. There is a React component [`ResponsivePicture`](./src/js/components/ResponsivePicture/responsivePicture.jsx) that receives the image `formats` and `availableWidths` to help you create the HTML element.
- Recommended reading: [Halve the size of images by optimising for high density displays](https://jakearchibald.com/2021/serving-sharp-images-to-high-density-screens/)

## FAQs

### There is a flash of unstyled content (FOUC). Is this intentional?

The FOUC originates from `style-loader` which adds the CSS files to the DOM using JavaScript. This is not the case on a production build as `style-loader` is replaced by `mini-css-extract-plugin`.

### During development, I cannot see legacy bundles.

Legacy bundles are only compiled when serving a production build so as not to slow down the Webpack compile-time and feedback loop.

### Error: loadable: cannot find `MyPage` in stats

This error occurs when you have added a new dynamically imported bundle but have not yet compiled. If the issue doesn't resolve itself automatically, try re-running `npm start`.

### Can I use the mock API in production?

The API could be a simple hard-coded JSON file, so as long as the data is publicly accessible you can continue using the mock API.

## GitHub Actions

The template includes a GitHub action [`build.yml`](./.github/workflows/build.yml) that builds the Docker image when code is merged to the `main` branch or a pull request to `main` is created or updated.

This could be extended to deploy the application to your development or production environment. As an example, deploying to AWS EB could be done by adding the following snippet at the end of `build.yml`:

```
      - name: EB Deploy
        uses: hmanzur/actions-aws-eb@v1.0.0
        with:
          command: "deploy ${{ secrets.aws_env_prod }} --timeout 20"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.aws_access_key_id }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.aws_secret_access_key }}
          AWS_DEFAULT_REGION: "eu-central-1"
```

## Webpack v4

If you are looking for a Webpack v4 compatible version, please see branch [`webpack-4`](https://github.com/kevinfarrugia/performance-first-react-template/tree/webpack-4), but be aware that this branch is no longer maintained.

## Inspiration

The project was inspired by [React Starter Kit](https://github.com/kriasoft/react-starter-kit/master) and [Create React App](https://github.com/facebook/create-react-app), although I have altered many bits to better suit my personal preferences, which usually center around simplicity or performance. As a result, the code is opinionated while following the best standards and practices.

## Contributing

Anyone and everyone are welcome to contribute to this project and leave feedback. Please take a moment to review the [guidelines for contributing](./contributing.md).

## License

Copyright © 2020-present Spiffing Ltd. This source code is licensed under the MIT license found in the [LICENSE](./LICENSE) file.

---

Please feel free to get in touch with me. Kevin Farrugia ([@imkevdev](https://twitter.com/imkevdev))
