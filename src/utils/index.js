const { fetchDataForAllYears } = require("./fetch");
const alerts = require("./alerts");
const twitter = require("./twitter")(alerts);

module.exports = {
  fetch: fetchDataForAllYears,
  alerts,
  twitter
};
