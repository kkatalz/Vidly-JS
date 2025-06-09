const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.error(
      "jwtPrivateKey is not set. Please define it as an environment variable using command '$env:vidly_jwtPrivateKey = 'pass''."
    );
    process.exit(1);
  }
};
