const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const cache = require("memory-cache");

const app = express();

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
    });
}

async function fetchDataForAllYears(username) {
  const years = await fetchYears(username);
  return Promise.all(years.map(year => fetchDataForYear(year.href))).then(
    resp =>
      resp
        .reduce((list, curr) => [...list, ...curr], [])
        .sort((a, b) => {
          if (a.date < b.date) return 1;
          else if (a.date > b.date) return -1;
          return 0;
        })
        .reduce((list, curr) => {
          return {
            ...list,
            [curr.date]: curr.count
          };
        }, {})
  );
}

app.get("/", (req, res) => {
  res.send(`memsize=${cache.memsize()}`);
});

app.get("/v1/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const cached = cache.get(username);
    if (cached !== null) {
      return res.json(cached);
    }
    const data = await fetchDataForAllYears(username);
    cache.put(username, data, 1000 * 3600); // Store for an hour
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(8080, () => {
  console.log("Server started.");
});
