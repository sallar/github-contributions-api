const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const cache = require("memory-cache");
const cors = require("cors");
const Twitter = require("twitter");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_CONSUMER_KEY,
  access_token_secret: process.env.TWITTER_CONSUMER_KEY
});

const COLOR_MAP = {
  "#196127": 4,
  "#239a3b": 3,
  "#7bc96f": 2,
  "#c6e48b": 1,
  "#ebedf0": 0
};

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

async function fetchDataForYear(url, year) {
  const data = await fetch(`https://github.com${url}`);
  const $ = cheerio.load(await data.text());
  $days = $("rect.day");
  const contribText = $(".js-contribution-graph h2")
    .text()
    .trim()
    .match(/^([0-9,]+)\s/);
  let contribCount;
  if (contribText) {
    [contribCount] = contribText;
    contribCount = parseInt(contribCount.replace(/,/g, ""), 10);
  }
  return {
    year,
    total: contribCount || 0,
    range: {
      start: $($days.get(0)).attr("data-date"),
      end: $($days.get($days.length - 1)).attr("data-date")
    },
    contributions: $days.get().map(day => {
      const $day = $(day);
      const color = $day.attr("fill");
      return {
        date: $day.attr("data-date"),
        count: parseInt($day.attr("data-count"), 10),
        color,
        intensity: COLOR_MAP[color.toLowerCase()] || 0
      };
    })
  };
}

async function fetchDataForAllYears(username) {
  const years = await fetchYears(username);
  return Promise.all(
    years.map(year => fetchDataForYear(year.href, year.text))
  ).then(resp => {
    return {
      years: resp.map(year => {
        const { contributions, ...rest } = year;
        return rest;
      }),
      contributions: resp
        .reduce((list, curr) => [...list, ...curr.contributions], [])
        .sort((a, b) => {
          if (a.date < b.date) return 1;
          else if (a.date > b.date) return -1;
          return 0;
        })
    };
  });
}

async function getMediaUrl(base64data, res) {
  try {
    const media_res = await twitterClient.post("media/upload", {
      media_data: base64data
    });
    const tweet_res = await twitterClient.post("statuses/update", {
      status: "canvas",
      media_ids: media_res.media_id_string
    });
    const image_url = tweet_res.entities.media[0].media_url;
    res.json({
      image_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toJSON());
  }
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
    console.error(err);
    res.status(500).send(err.toJSON());
  }
});

app.post("/twitter", (req, res) => {
  const base64data = req.body.image.replace(/^data:image\/png;base64,/, "");
  getMediaUrl(base64data, res);
});

app.listen(8080, () => {
  console.log("Server started.");
});
