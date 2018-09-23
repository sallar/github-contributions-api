const fetch = require("./fetch");
const alerts = require("./alerts");
const twitter = require("./twitter")(alerts);

module.exports = {
  fetch,
  alerts,
  twitter
};
