/**
 * Webpack Configuration inspired by React Starter Kit (https://www.reactstarterkit.com/)
 */

import crypto from "crypto";
import path from "path";

import CompressionPlugin from "compression-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import StyleLintPlugin from "stylelint-webpack-plugin";
import TerserJSPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import nodeExternals from "webpack-node-externals";
import WorkboxPlugin from "workbox-webpack-plugin";

import pkg from "../package.json";

const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(ROOT_DIR, "src");
const OUTPUT_DIR = path.resolve(ROOT_DIR, "build");

// configure env variable if assets are served from different domain
const CDN_URL = process.env.CDN_URL || "";

// the total number of entrypoints (including async chunks)
const ENTRYPOINTS_COUNT = 1;

const FRAMEWORK_BUNDLES = ["react", "react-dom", "scheduler", "prop-types"];

// returns true if module is CSS
const isModuleCSS = (module) => {
  return (
    // mini-css-extract-plugin
    module.type === `css/mini-extract` ||
    // extract-css-chunks-webpack-plugin (old)
    module.type === `css/extract-chunks` ||
    // extract-css-chunks-webpack-plugin (new)
    module.type === `css/extract-css-chunks`
  );
};

const splitChunksConfig = {
  dev: {
    cacheGroups: {
      vendors: false,
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
              .update(
                chunks.reduce((acc, chunk) => {
                  return acc + chunk.name;
                }, "")
              )
              .digest("hex") + (isModuleCSS(module) ? "_CSS" : "")
          );
        },
        priority: 10,
        minChunks: 2,
        reuseExistingChunk: true,
      },
      // bundle all critical into one stylesheet to inline in the HTML
      criticalStyles: {
        name: "critical",
        test: /critical\.(sa|sc|c)ss$/,
        chunks: "initial",
        priority: 40,
        enforce: true,
      },
    },
  },
};

const isDevelopment = !process.argv.includes("--release");
const isAnalyze =
  process.argv.includes("--analyze") || process.argv.includes("--analyse");

const staticAssetName = isDevelopment
  ? "[path][name].[ext]?[hash:8]"
  : "[contenthash:8].[ext]";

const config = {
  context: ROOT_DIR,
  mode: isDevelopment ? "development" : "production",
  output: {
    path: path.resolve(ROOT_DIR, OUTPUT_DIR, "public"),
    publicPath: "/",
    filename: isDevelopment ? "[name].js" : "[name].[chunkhash:8].js",
    chunkFilename: isDevelopment ? "[name].js" : "[name].[chunkhash:8].js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  cache: isDevelopment,
  devtool: isDevelopment ? "eval-source-map" : "source-map",
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        loader: "eslint-loader",
        exclude: /node_modules/,
        options: {
          fix: true,
          emitWarning: true,
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        rules: [
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
              localsConvention: "camelCaseOnly",
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
        test: /\.(woff2?|[ot]tf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts",
            },
          },
        ],
      },
      {
        exclude: [
          /\.(js|jsx)$/,
          /\.(sa|sc|c)ss$/,
          /\.(jpe?g|png|gif|svg|webp|avif)$/,
          /\.(woff2?|[ot]tf|eot)$/,
          /\.json$/,
          /\.hbs$/,
        ],
        loader: "file-loader",
        options: {
          name: staticAssetName,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.OUTPUT_DIR": JSON.stringify(OUTPUT_DIR),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.IS_DEVELOPMENT": isDevelopment,
      "process.env.NAME": JSON.stringify(pkg.name),
      "process.env.DESCRIPTION": JSON.stringify(pkg.description),
      "process.env.VERSION": JSON.stringify(pkg.version),
      "process.env.CDN_URL": JSON.stringify(CDN_URL),
    }),
    new StyleLintPlugin({ fix: true }),
    new MiniCssExtractPlugin({
      filename: `${isDevelopment ? "[name].css" : "[name].[contentHash].css"}`,
      chunkFilename: `${
        isDevelopment ? "[name].css" : "[name].[contentHash].css"
      }`,
    }),
  ],
};

const clientConfig = {
  ...config,
  name: "client",
  target: "web",
  entry: {
    client: ["./src/client.js"],
    polyfills: ["./src/polyfills.js"],
  },
  resolve: {
    ...config.resolve,
  },
  module: {
    ...config.module,
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        rules: [
          {
            // style-loader causes a FOUC but allows HMR for styles - if you don't require HMR it may be replaced by MiniCssExtractPlugin.loader
            loader: isDevelopment
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
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
                corejs: "3.8",
                debug: false,
              },
            ],
            ["@babel/preset-react", { development: isDevelopment }],
          ],
          plugins: [
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
                loader: "svg-url-loader",
                options: {
                  name: staticAssetName,
                  limit: 4096,
                },
              },
              {
                loader: "url-loader",
                options: {
                  name: staticAssetName,
                  limit: 4096,
                },
              },
            ],
          },
          {
            loaders: [
              {
                loader: "file-loader",
                options: {
                  name: staticAssetName,
                },
              },
              {
                loader: "image-webpack-loader",
                options: {
                  bypassOnDebug: true,
                  svgo: {},
                },
              },
            ],
          },
        ],
      },
      ...config.module.rules,
    ],
  },
  plugins: [
    ...config.plugins,
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      filename: "index.hbs",
      showErrors: isDevelopment,
      template: path.join(ROOT_DIR, "src/templates", "index.hbs"),
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "500.hbs",
      showErrors: isDevelopment,
      template: path.join(ROOT_DIR, "src/templates", "500.hbs"),
      inject: false,
    }),
    ...(isDevelopment
      ? []
      : [
          new CompressionPlugin({
            filename: "[path].br[query]",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg)$/,
            compressionOptions: { level: 11 },
            threshold: 8192,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          }),
          new CompressionPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.(js$|css$|html)$/,
            threshold: 8192,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          }),
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
        cache: true,
        sourceMap: true,
        terserOptions: {
          compress: !isDevelopment,
          mangle: true,
        },
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          zindex: false,
        },
      }),
    ],
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
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
      {
        test: /\.(sa|sc|c)ss$/,
        rules: [
          {
            loader: MiniCssExtractPlugin.loader,
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
                  node: pkg.engines.node.match(/(\d+\.?)+/)[0],
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
                loader: "svg-url-loader",
                options: {
                  emitFile: false,
                },
              },
              {
                loader: "url-loader",
                options: {
                  emitFile: false,
                },
              },
            ],
          },
          {
            loaders: [
              {
                loader: "file-loader",
                options: {
                  name: staticAssetName,
                  emitFile: false,
                },
              },
              {
                loader: "image-webpack-loader",
                options: {
                  bypassOnDebug: true,
                  svgo: {},
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(woff2?|[ot]tf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: staticAssetName,
              emitFile: false,
            },
          },
        ],
      },
      ...config.module.rules,
    ],
  },
  externals: [nodeExternals()],
  plugins: [...config.plugins],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

export default [clientConfig, serverConfig];
