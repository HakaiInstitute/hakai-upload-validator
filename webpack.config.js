module.exports = {
  entry: "./src/processWorkBookAndValidate.js",
  output: {
    library: "hakai-upload-validator",
    libraryTarget: "umd",
    umdNamedDefine: true,
    path: `${__dirname}/dist`,
    filename: "validate.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};
