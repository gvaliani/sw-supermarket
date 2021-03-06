module.exports = {
  resolve: {
    alias: {
      // jquery: '../bower_components/jquery/dist/jquery.min.js',
      // jquery_validation: '../bower_components/jquery-validation/dist/jquery.validate.min.js',
      // validation_additional_methods: '../bower_components/jquery-validation/dist/additional-methods.min.js',
      // sammy: '../bower_components/sammy/lib/min/sammy-latest.min.js',
      // mustache: '../bower_components/mustache.js/mustache.min.js'
    }
  },
  module: {
    loaders: [
      { test: /\.html$/, loader: 'raw' },
      // Transpile any JavaScript file:
      { test: /\.js$/, loader: 'webpack-traceur?sourceMaps&experimental&asyncFunctions=true' }
    ]
  },
  entry: './app/app.module.js',
  output: {
    filename: 'app.bundle.js'
  }
}
