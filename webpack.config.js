const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const path = require("path");

const cssLoaders = [parts.autoprefix(), parts.tailvind()];
const commonConfig = merge([
  { entry: ["./src"] },
  {
    output: {
      publicPath: "/",
      path: path.resolve(process.cwd(), "dist"),
    },
  },
  {
    resolve: {
      extensions: [".ts", ".js"],
    },
  },
  parts.page({ title: "Demo" }),
  parts.extractCSS({ loaders: cssLoaders }),
  parts.loadImages({ limit: 15000 }),
  parts.loadJavaScript(),
  parts.loadTypeScript(),
  parts.clean(),
  parts.attachRevision(),
  parts.minifyJavaScript(),
  parts.minifyCSS({ options: { preset: ["default"] } }),
  parts.setFreeVariable("HELLO", "hello from config"),
]);

const productionConfig = merge([
  parts.eliminateUnusedCSS(),
  parts.generateSourceMaps({ type: "source-map" }),
  {
    optimization: {
      splitChunks: {
        // css/mini-extra is injected by mini-css-extract-plugin
        minSize: { javascript: 2000, "styles/mini-extra": 10000 },
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
    },
  },
]);

const developmentConfig = merge([
  { entry: ["webpack-plugin-serve/client"] },
  parts.devServer(),
]);

const getConfig = (mode) => {
  process.env.NODE_ENV = mode;
  switch (mode) {
    case "production":
      return merge(commonConfig, productionConfig, { mode });
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an anknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
