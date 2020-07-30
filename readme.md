# Performance-First React Template

PFRT is a boilerplate for universal React web development with performance treated as a first-class citizen. Built using [Node.js](https://nodejs.org/), [Express](http://expressjs.com/) and
[React](https://facebook.github.io/react/) and bundled using [Webpack](http://webpack.github.io/) and [Babel](http://babeljs.io/). The goal is to provide a simple, flexible (not constrained to using Redux or any other pattern) and extensible starting point for universal React web development. The boilerplate includes critical CSS, service worker using Workbox, server-side rendering, async CSS using `media=print` technique, code-splitting & more.

## Scope
The goal of this project is to create a reference for a fast performing website configuration. Of course there may be many variations (some performing better than PFRF) and you would want to mix and match with your own configurations; however I will try to keep this updated with the latest findings and research and your input would be very valuable.

## Getting Started
If you don't already have Node.js, download and install [Node.js](https://nodejs.org/en/) >= 12.18.1

### Folder Structure

```
.
├── /build/                     # Compiled output
├── /public/                    # Static files which are copied into the /build/public folder
├── /scripts/                     # Build automation scripts and utilities
│   ├── /lib/                   # Library for utility snippets
│   ├── /build.js               # Builds the project from source to output (build) folder
│   ├── /bundle.js              # Bundles the web resources into package(s) through Webpack
│   ├── /clean.js               # Cleans up the output (build) folder
│   ├── /copy.js                # Copies static files to output (build) folder
│   ├── /run.js                 # Helper function for running build automation tasks
│   ├── /runServer.js           # Launches (or restarts) Node.js server
│   ├── /start.js               # Launches the development web server with "live reload"
│   └── /webpack.config.js      # Configurations for client-side and server-side bundles
├── /src/                       # The source code of the application
│   ├── /js/                    # JavaScript application code
│   ├── /scss/                  # Global SCSS files
│   ├── /service/               # Service-layer & API integration
│   ├── /templates/             # Handlebar templates used to render HTML content in Express
│   ├── /client.js              # Entry point for client-side script
│   ├── /render.js              # Handles SSR for React application
│   ├── /server.js              # Entry point for server-side script
│   ├── /sw.js                  # Service Worker used by WorkboxPlugin.InjectManifest
├── Dockerfile                  # Commands for building a Docker image for production
├── package.json                # The list of 3rd party libraries and utilities
└── package-lock.json           # Fixed versions of all the dependencies
```

### Quick Start
1. Install all dependencies and developer tools as listed in package.json:
```
npm install
```
2. Bundle & run the application in development mode
```
npm start
```

## Scripts
 Flag           | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| `build`       | Builds the project. Accepts `--release`, `--analyze`, `--docker` flags              |
| `build-stats` | Build the project with production configuration and launches [Webpack Bundle Analyzer](https://github.com/th0r/webpack-bundle-analyzer)                                                     |
| `serve`       | Runs the Express server and serves the output from the build folder                                                                                                |
| `start`       | Launches Webpack compiler in watch mode (via [webpack-middleware](https://github.com/kriasoft/webpack-middleware)) and runs the development server, including HMR and BrowserSync. Accepts `--release`, `--hot` flags                                                                                               |

### Production
For the production environment, you are expected to run the following scripts
```
npm run build -- --release --verbose     # build the app in production mode
npm run serve                            # launch the server using the output of the previous step
```

### Arguments
To pass arguments to the NPM script, you are required to use double dashes, ex:
```
npm run build -- --release
```

## Redux
[Redux](https://redux.js.org/) is a state container often used together with React. The template does not require Redux, however it works perfectly well with Redux, [Redux Toolkit](https://redux-toolkit.js.org/)  and also [reselect](https://github.com/reduxjs/reselect). When implementing a Redux solution, if data is fetched from the server-side it is recommended to follow this [recipe](https://redux.js.org/recipes/server-rendering).

_I will try to create a branch including Redux, React Router and other commonly used frameworks._

## Hot Module Reloading
The project allows for Hot Module Reloading using `webpack-hot-middleware` and a helper library included in React Starter Kit. This enables HMR for JSX, S/CSS and Express. However, it causes a FOUC since `style-loader` styles are injected through JavaScript. If you wish to remove the FOUC and do not require HMR for CSS, you may replace `style-loader` with `MiniCssExtractPlugin.loader` inside the Webpack configuration.

## Inspiration
The project is heavily inspired by the fantastic [React Starter Kit](https://github.com/kriasoft/react-starter-kit/) 👏, although I have altered many bits to better suit my personal preferences which usually center around simplicity or performance. As a result, the code is opinionated and attempts to follow the best/standard practices.

## Contributing

Anyone and everyone is welcome to contribute to this project and leave feedback. Please take a moment to review the [guidelines for contributing](contributing.md).

## License 

Copyright © 2020 Spiffing Ltd. This source code is licensed under the MIT license found in the [LICENSE](LICENSE) file.

---

Please feel free to get in touch with me. Kevin Farrugia ([@imkevdev](https://twitter.com/imkevdev))
