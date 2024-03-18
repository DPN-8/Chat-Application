const path = require('path');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "constants": require.resolve("constants-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "buffer": require.resolve("buffer/")
        }
      }
    }
  }
};
