const { fetchDataForAllYears } = require("./fetch");
const alerts = require("./alerts");
const getTwitterMediaUrl = require("./twitter")(alerts);

module.exports = {
  fetch: fetchDataForAllYears,
  alerts,
  getTwitterMediaUrl
};
