/**
 * Webpack Configuration inspired by React Starter Kit (https://www.reactstarterkit.com/)
 */

import crypto from "crypto";
import path from "path";

import LoadablePlugin from "@loadable/webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import svgToMiniDataURI from "mini-svg-data-uri";
import StyleLintPlugin from "stylelint-webpack-plugin";
import TerserJSPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import nodeExternals from "webpack-node-externals";
import WorkboxPlugin from "workbox-webpack-plugin";

import pkg from "../package.json";

const isDevelopment = !process.argv.includes("--release");

const isAnalyze =
  process.argv.includes("--analyze") || process.argv.includes("--analyse");

const staticAssetName = isDevelopment
  ? "[hash:8][ext][query]"
  : "[contenthash:8][ext]";

const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(ROOT_DIR, "src");
const OUTPUT_DIR = path.resolve(ROOT_DIR, "build");

const CMS_URL = "https://example.com";

// the total number of entrypoints (including async chunks)
const ENTRYPOINTS_COUNT = 1;

const FRAMEWORK_BUNDLES = ["react", "react-dom", "scheduler", "prop-types"];

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

const config = {
  stats: {
    errorDetails: true,
  },
  context: ROOT_DIR,
  mode: isDevelopment ? "development" : "production",
  output: {
    path: path.resolve(OUTPUT_DIR, "public"),
    publicPath: "/",
    filename: isDevelopment ? "[name].js" : "[name].[chunkhash:8].js",
    chunkFilename: isDevelopment ? "[name].js" : "[name].[chunkhash:8].js",
  },
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
    new LoadablePlugin(),
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

const clientConfig = {
  ...config,
  name: "client",
  target: "web",
  entry: {
    client: ["./src/polyfills.js", "./src/client.js"],
  },
  resolve: {
    ...config.resolve,
  },
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.(sa|sc|c)ss$/,
        rules: [
          {
            loader: isDevelopment
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
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
      },
      {
        test: /\.(js|jsx)$/,
        include: [SRC_DIR, path.resolve(ROOT_DIR, "scripts")],
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
                  browsers: pkg.browserslist,
                },
                bugfixes: true,
                modules: false,
                useBuiltIns: "entry",
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
      },
    ],
  },
  plugins: [
    ...config.plugins,
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
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
  ...config,
  name: "server",
  target: "node",
  entry: {
    server: ["./src/server.js"],
  },
  output: {
    ...config.output,
    path: OUTPUT_DIR,
    filename: "[name].js",
    chunkFilename: "chunks/[name].js",
    libraryTarget: "commonjs2",
  },
  // https://github.com/webpack/webpack/issues/4817
  resolve: {
    ...config.resolve,
  },
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
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
        include: [SRC_DIR, path.resolve(ROOT_DIR, "scripts")],
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
            "@babel/plugin-syntax-dynamic-import",
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
    ...config.plugins,
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

export default [clientConfig, serverConfig];
