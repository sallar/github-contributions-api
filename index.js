const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const app = express();

async function fetchDataForYear(url) {
  const data = await fetch(`https://github.com${url}`);
  const $ = cheerio.load(await data.text());
  return $("rect.day")
    .get()
    .map(day => {
      const $day = $(day);
      return {
        date: $day.attr("data-date"),
        count: parseInt($day.attr("data-count"), 10)
      };
    })
    .reduce((list, curr) => {
      list[curr.date] = curr.count;
      return list;
    }, {});
}

async function fetchYears(username) {
  const data = await fetch(`https://github.com/${username}`);
  const $ = cheerio.load(await data.text());
  return $(".js-year-link")
    .get()
    .map(a => {
      const $a = $(a);
      return {
        href: $a.attr("href"),
        text: $a.text().trim()
      };
    });
}

async function fetchDataForAllYears(username) {
  const years = await fetchYears(username);
  return Promise.all(years.map(year => fetchDataForYear(year.href))).then(
    resp => {
      return resp.reduce(
        (list, curr) => ({
          ...list,
          ...curr
        }),
        {}
      );
    }
  );
}

app.get("/:username", async (req, res) => {
  try {
    const data = await fetchDataForAllYears(req.params.username);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(8080, () => {
  console.log("Server started.");
});
