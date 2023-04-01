// @ts-check

/** @typedef {import('webpack').Configuration} WebpackConfig **/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import PostcssHtmlTransform from "./plugins/postcss-weapp.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cssLoaders = (transformHtml = false) => [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          [
            "postcss-preset-env",
            {
              stage: 3,
            },
          ],
          ...(transformHtml ? [PostcssHtmlTransform] : []),
        ],
      },
    },
  },
];

const jsBabelPresets = [
  [
    "@babel/preset-env",
    {
      targets: {
        ios: "9",
        android: "5",
      },
      useBuiltIns: "entry",
      corejs: "3.29.1",
      // forceAllTransforms: true,
      // shippedProposals: true,
    },
  ],
];
const tsBabelPresets = [...jsBabelPresets, ["@babel/preset-typescript"]];

const appInfo = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./src/app.json")).toString()
);
const pageEnties = Object.fromEntries(
  appInfo.pages.map((name) => [
    name,
    {
      import: `./src/${name}.tsx`,
    },
  ])
);
const pageCopies = appInfo.pages.map((name) => ({
  from: "template/page",
  to: path.dirname(name),
}));

const taroRuntimeProvides = [
  "window",
  "document",
  "navigator",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  // UPSTREAM: Event, Node and Text are missing in taro's default provide config
  ["Event", "TaroEvent"],
  // required by solid-js/web -> dom-expressions' default web renderer
  ["Node", "TaroNode"],
  ["Text", "TaroText"],
  ["Element", "TaroElement"],
  "SVGElement",
  "MutationObserver",
  "history",
  "location",
  "URLSearchParams",
  "URL",
].reduce((res, name) => {
  if (Array.isArray(name)) {
    const [provide, exportName] = name;
    res[provide] = ["@tarojs/runtime", exportName];
  } else {
    res[name] = ["@tarojs/runtime", name];
  }
  return res;
}, {});

/** @type {WebpackConfig} */
const config = {
  mode: "development",
  devtool: false,
  // to use require() to import chunks
  target: "node",
  context: __dirname,
  output: {
    globalObject: "wx",
  },
  entry: {
    app: {
      import: "./src/app.ts",
    },
    comp: {
      import: "./src/comp.ts",
    },
    ...pageEnties,
  },
  cache: {
    type: "filesystem",
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: "all",
          /** @param module {any} */
          test(module) {
            return (
              /[\\/]node_modules[\\/]/.test(module.resource) &&
              !/^css/.test(module.type)
            );
          },
          priority: -10,
          name: "vendors",
          filename: "[name].bundle.js",
        },
        common: {
          chunks: "all",
          /** @param module {any} */
          test(module) {
            return (
              !/src[\\/]((pages)|(app)|(comp))/.test(module.resource) &&
              !/^css/.test(module.type)
            );
          },
          priority: -15,
          name: "common",
          filename: "[name].bundle.js",
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.TARO_ENV": `"weapp"`,
      "process.env.FRAMEWORK": `"solid"`,
      ENABLE_INNER_HTML: true,
      ENABLE_ADJACENT_HTML: false,
      ENABLE_SIZE_APIS: false,
      ENABLE_TEMPLATE_CONTENT: true,
      ENABLE_CLONE_NODE: true,
      ENABLE_CONTAINS: false,
      ENABLE_MUTATION_OBSERVER: false,
    }),
    new webpack.ProvidePlugin({
      ...taroRuntimeProvides,
    }),
    new CopyPlugin({
      patterns: ["src/app.json", "template/app", ...pageCopies],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].wxss",
    }),
    // new MinaRuntimeWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: jsBabelPresets,
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: tsBabelPresets,
          },
        },
      },
      {
        oneOf: [
          {
            test: /(taro).*\.tsx$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ...tsBabelPresets,
                  [
                    "babel-preset-solid",
                    {
                      // NOTE: only applies to static template elements,
                      // doesn't work for event props assigned with {...props} / spread(props)
                      delegateEvents: false,
                    },
                  ],
                ],
              },
            },
          },
          {
            test: /\.tsx$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ...tsBabelPresets,
                  [
                    "babel-preset-solid",
                    {
                      moduleName: "solid-mp-vdom-renderer",
                      generate: "universal",
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        oneOf: [
          {
            test: /vendor.s[ac]ss$/i,
            use: [...cssLoaders(true), "sass-loader"],
          },
          {
            test: /\.s[ac]ss$/i,
            use: [...cssLoaders(), "sass-loader"],
          },
        ],
      },
      {
        test: /\.css$/i,
        use: cssLoaders(),
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", "..."],
    // IMPORTANT: Don't include "node". And make sure "browser" take precedence over "node",
    //            otherwise non-reactive server bundle of solid-js would be resolved
    conditionNames: ["development", "browser", "import", "require"],
  },
};

export default config;
