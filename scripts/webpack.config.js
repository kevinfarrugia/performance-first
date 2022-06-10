const crypto = require("crypto");
const path = require("path");

const LoadablePlugin = require("@loadable/webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const svgToMiniDataURI = require("mini-svg-data-uri");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const nodeExternals = require("webpack-node-externals");
const WorkboxPlugin = require("workbox-webpack-plugin");

const pkg = require("../package.json");

const isDevelopment = !process.argv.includes("--release");

const isAnalyze =
  process.argv.includes("--analyze") || process.argv.includes("--analyse");

const staticAssetName = isDevelopment
  ? "[hash:8][ext][query]"
  : "[contenthash:8][ext]";

const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(ROOT_DIR, "src");
const OUTPUT_DIR = path.resolve(ROOT_DIR, "build");

const CMS_URL = "https://raw.githubusercontent.com";

// the total number of entrypoints (including async chunks)
const ENTRYPOINTS_COUNT = 4;

const FRAMEWORK_BUNDLES = [
  "react",
  "react-dom",
  "redux",
  "react-redux",
  "scheduler",
  "prop-types",
];

const configureImageLoaders = () => ({
  test: /\.(jpe?g|png|gif|svg|webp|avif)$/i,
  oneOf: [
    {
      issuer: /\.(sa|sc|c)ss$/,
      oneOf: [
        {
          test: /\.svg$/,
          type: "asset",
          generator: {
            filename: staticAssetName,
            dataUrl: (content) => svgToMiniDataURI(content.toString()),
          },
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
        {
          type: "asset",
          generator: {
            filename: staticAssetName,
          },
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 4kb
            },
          },
        },
      ],
    },
    {
      type: "asset/resource",
      generator: {
        filename: staticAssetName,
      },
    },
  ],
});

const configureStyleLoaders = () => ({
  test: /\.(sa|sc|c)ss$/,
  rules: [
    {
      loader: isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
    },
    {
      exclude: SRC_DIR,
      loader: "css-loader",
      options: {
        sourceMap: isDevelopment,
      },
    },
    {
      include: SRC_DIR,
      loader: "css-loader",
      options: {
        modules: {
          localIdentName: isDevelopment
            ? "[name]-[local]-[hash:base64:5]"
            : "[hash:base64:5]",
        },
        importLoaders: 1,
        sourceMap: isDevelopment,
      },
    },
    {
      loader: "postcss-loader",
    },
    {
      loader: "resolve-url-loader",
    },
    {
      test: /\.(scss|sass)$/,
      loader: "sass-loader",
      options: {
        sassOptions: {
          includePaths: [path.resolve(SRC_DIR, "scss")],
        },
      },
    },
    {
      loader: "sass-resources-loader",
      options: {
        resources: [
          path.resolve(SRC_DIR, "scss", "vars.scss"),
          path.resolve(SRC_DIR, "scss", "mixins.scss"),
        ],
      },
    },
  ],
});

const configureBabelLoader = (browserslist) => {
  if (!browserslist) {
    throw new Error("Please provide a browserslist configuration.");
  }
  return {
    test: /\.(js|jsx)$/,
    include: [SRC_DIR],
    loader: "babel-loader",
    options: {
      cacheDirectory: isDevelopment,
      babelrc: false,
      configFile: false,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              browsers: browserslist,
            },
            bugfixes: true,
            modules: false,
            useBuiltIns: "usage",
            corejs: "3.21",
            debug: false,
          },
        ],
        ["@babel/preset-react", { development: isDevelopment }],
      ],
      plugins: [
        "@loadable/babel-plugin",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-syntax-dynamic-import",
        ...(isDevelopment ? [] : ["@babel/transform-react-constant-elements"]),
        ...(isDevelopment ? [] : ["@babel/transform-react-inline-elements"]),
      ],
    },
  };
};

// returns true if module is CSS
const isModuleCSS = (module) =>
  // mini-css-extract-plugin
  module.type === `css/mini-extract` ||
  // extract-css-chunks-webpack-plugin (old)
  module.type === `css/extract-chunks` ||
  // extract-css-chunks-webpack-plugin (new)
  module.type === `css/extract-css-chunks`;

const splitChunksConfig = {
  dev: {
    cacheGroups: {
      defaultVendors: false,
      default: false,
    },
  },
  prod: {
    chunks: "all",
    maxInitialRequests: 25,
    minSize: 20000,
    cacheGroups: {
      // disable Webpack's default cacheGroup
      default: false,
      // disable Webpack's default vendor cacheGroup
      vendors: false,
      // create a framework bundle that contains libraries that hardly change
      framework: {
        name: "framework",
        // https://github.com/vercel/next.js/pull/9012
        test: new RegExp(
          `(?<!node_modules.*)[\\\\/]node_modules[\\\\/](${FRAMEWORK_BUNDLES.join(
            `|`
          )})[\\\\/]`
        ),
        priority: 40,
        enforce: true,
      },
      // big modules that are over 160kb are moved to their own file
      lib: {
        test(module) {
          return (
            module.size() > 160000 &&
            /node_modules[/\\]/.test(module.identifier())
          );
        },
        name(module) {
          const hash = crypto.createHash("sha1");
          if (isModuleCSS(module)) {
            module.updateHash(hash);
          } else {
            if (!module.libIdent) {
              throw new Error(
                `Encountered unknown module type: ${module.type}.`
              );
            }

            hash.update(module.libIdent({ context: OUTPUT_DIR }));
          }

          return hash.digest("hex").substring(0, 8);
        },
        priority: 30,
        minChunks: 1,
        reuseExistingChunk: true,
      },
      // if a chunk is used on all components we put it in commons (we need at least 2 components)
      commons: {
        name: "commons",
        minChunks: Math.max(ENTRYPOINTS_COUNT, 2),
        priority: 20,
      },
      // if a chunk is used in at least 2 components we create a separate chunk
      shared: {
        name(module, chunks) {
          return (
            crypto
              .createHash("sha1")
              .update(chunks.reduce((acc, chunk) => acc + chunk.name, ""))
              .digest("hex") + (isModuleCSS(module) ? "_CSS" : "")
          );
        },
        priority: 10,
        minChunks: 2,
        reuseExistingChunk: true,
      },
    },
  },
};

const baseConfig = {
  stats: {
    errorDetails: true,
    colors: true,
  },
  context: ROOT_DIR,
  mode: isDevelopment ? "development" : "production",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  cache: isDevelopment,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(woff2?|[ot]tf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        exclude: [
          /\.(js|jsx)$/,
          /\.(sa|sc|c)ss$/,
          /\.(jpe?g|png|gif|svg|webp|avif)$/,
          /\.(woff2?|[ot]tf|eot)$/,
          /\.json$/,
        ],
        type: "asset/resource",
        generator: {
          filename: staticAssetName,
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      IS_DEVELOPMENT: isDevelopment,
      NAME: JSON.stringify(pkg.name),
      DESCRIPTION: JSON.stringify(pkg.description),
      VERSION: JSON.stringify(pkg.version),
    }),
    new webpack.DefinePlugin({
      CMS_URL: JSON.stringify(CMS_URL),
    }),
    new ESLintPlugin({
      extensions: ["js", "jsx"],
      exclude: "node_modules/",
      fix: true,
      emitWarning: true,
    }),
    new StyleLintPlugin({ customSyntax: "postcss-scss", fix: true }),
  ],
};

const legacyClientConfig = {
  ...baseConfig,
  name: "legacy",
  target: "web",
  output: {
    path: path.resolve(OUTPUT_DIR, "public"),
    publicPath: "/",
    filename: isDevelopment ? "[name].js" : "[name].[chunkhash:8].js",
    chunkFilename: isDevelopment ? "[name].js" : "[name].[chunkhash:8].js",
  },
  entry: {
    client: ["./src/polyfills.js", "./src/client.js"],
  },
  module: {
    ...baseConfig.module,
    rules: [
      ...baseConfig.module.rules,
      configureStyleLoaders(),
      configureBabelLoader(pkg.browserslist),
      configureImageLoaders(),
    ],
  },
  plugins: [
    ...baseConfig.plugins,
    new LoadablePlugin({
      filename: "legacy-stats.json",
    }),
    new MiniCssExtractPlugin({
      filename: `${isDevelopment ? "[name].css" : "[name].[contenthash].css"}`,
      chunkFilename: `${
        isDevelopment ? "[name].css" : "[name].[contenthash].css"
      }`,
    }),
    ...(isDevelopment
      ? []
      : [
          new WorkboxPlugin.InjectManifest({
            swSrc: `${ROOT_DIR}/src/sw.js`,
            swDest: "sw.js",
            include: [/\.js$/, /\.css$/],
          }),
        ]),
  ],
  optimization: {
    runtimeChunk: { name: "webpack" },
    splitChunks: isDevelopment ? splitChunksConfig.dev : splitChunksConfig.prod,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          compress: !isDevelopment,
          mangle: true,
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
};

const clientConfig = {
  ...baseConfig,
  name: "client",
  target: "web",
  output: {
    path: path.resolve(OUTPUT_DIR, "public"),
    publicPath: "/",
    filename: isDevelopment ? "[name].mjs" : "[name].[chunkhash:8].mjs",
    chunkFilename: isDevelopment ? "[name].mjs" : "[name].[chunkhash:8].mjs",
  },
  entry: {
    client: ["./src/client.js"],
  },
  module: {
    ...baseConfig.module,
    rules: [
      ...baseConfig.module.rules,
      configureStyleLoaders(),
      configureBabelLoader([
        // The last two versions of each browser, excluding versions
        // that don't support <script type="module">.
        "last 2 Chrome versions",
        "not Chrome < 60",
        "last 2 Safari versions",
        "not Safari < 10.1",
        "last 2 iOS versions",
        "not iOS < 10.3",
        "last 2 Firefox versions",
        "not Firefox < 54",
        "last 2 Edge versions",
        "not Edge < 15",
      ]),
      configureImageLoaders(),
    ],
  },
  plugins: [
    ...baseConfig.plugins,
    new LoadablePlugin({
      filename: "client-stats.json",
    }),
    new MiniCssExtractPlugin({
      filename: `${isDevelopment ? "[name].css" : "[name].[contenthash].css"}`,
      chunkFilename: `${
        isDevelopment ? "[name].css" : "[name].[contenthash].css"
      }`,
    }),
    ...(isDevelopment
      ? []
      : [
          new WorkboxPlugin.InjectManifest({
            swSrc: `${ROOT_DIR}/src/sw.js`,
            swDest: "sw.js",
            include: [/\.js$/, /\.css$/],
          }),
        ]),
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],
  optimization: {
    runtimeChunk: { name: "webpack" },
    splitChunks: isDevelopment ? splitChunksConfig.dev : splitChunksConfig.prod,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          compress: !isDevelopment,
          mangle: true,
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
};

const serverConfig = {
  ...baseConfig,
  name: "server",
  target: "node",
  entry: {
    server: ["./src/server.js"],
  },
  output: {
    path: OUTPUT_DIR,
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "chunks/[name].js",
    libraryTarget: "commonjs2",
  },
  // https://github.com/webpack/webpack/issues/4817
  module: {
    ...baseConfig.module,
    rules: [
      ...baseConfig.module.rules,
      {
        test: /\.(sa|sc|c)ss$/,
        rules: [
          ...(isDevelopment
            ? []
            : [
                {
                  loader: MiniCssExtractPlugin.loader,
                },
              ]),
          {
            include: SRC_DIR,
            loader: "css-loader",
            options: {
              sourceMap: false,
              modules: {
                localIdentName: isDevelopment
                  ? "[name]-[local]-[hash:base64:5]"
                  : "[hash:base64:5]",
                exportOnlyLocals: isDevelopment,
              },
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "resolve-url-loader",
          },
          {
            test: /\.(scss|sass)$/,
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [path.resolve(SRC_DIR, "scss")],
              },
            },
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: [
                path.resolve(SRC_DIR, "scss", "vars.scss"),
                path.resolve(SRC_DIR, "scss", "mixins.scss"),
              ],
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        include: [SRC_DIR],
        loader: "babel-loader",
        options: {
          cacheDirectory: isDevelopment,
          babelrc: false,
          configFile: false,
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  node: true,
                },
                bugfixes: true,
                modules: false,
                useBuiltIns: false,
                debug: false,
              },
            ],
            ["@babel/preset-react", { development: isDevelopment }],
          ],
          plugins: [
            "@loadable/babel-plugin",
            "@babel/plugin-proposal-class-properties",
            ...(isDevelopment
              ? []
              : ["@babel/transform-react-constant-elements"]),
            ...(isDevelopment
              ? []
              : ["@babel/transform-react-inline-elements"]),
          ],
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp|avif)$/i,
        oneOf: [
          {
            issuer: /\.(sa|sc|c)ss$/,
            oneOf: [
              {
                test: /\.svg$/,
                type: "asset",
                generator: {
                  filename: staticAssetName,
                  dataUrl: (content) => svgToMiniDataURI(content.toString()),
                },
                parser: {
                  dataUrlCondition: {
                    maxSize: 4 * 1024, // 4kb
                  },
                },
              },
              {
                type: "asset",
                generator: {
                  filename: staticAssetName,
                  emit: false,
                },
                parser: {
                  dataUrlCondition: {
                    maxSize: 4 * 1024, // 4kb
                  },
                },
              },
            ],
          },
          {
            type: "asset/resource",
            generator: {
              filename: staticAssetName,
              emit: false,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|[ot]tf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
          emit: false,
        },
      },
    ],
  },
  externals: ["@loadable/component", nodeExternals()],
  plugins: [
    ...baseConfig.plugins,
    new LoadablePlugin({
      filename: "server-stats.json",
    }),
    ...(isDevelopment
      ? []
      : [
          new MiniCssExtractPlugin({
            filename: "[name].css",
          }),
        ]),
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
};

module.exports = [clientConfig, serverConfig, legacyClientConfig];
