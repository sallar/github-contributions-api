const express = require("express");
const bodyParser = require("body-parser");
const cache = require("memory-cache");
const cors = require("cors");
const Twitter = require("twitter");
const VError = require("verror").WError;
const dataUriToBuffer = require("data-uri-to-buffer");
const fetchDataForAllYears = require("./fetch_data_for_all_years");

const app = express();
app.use(cors());
app.use(
  bodyParser.json({
    limit: "1mb"
  })
);

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

async function getMediaUrl(base64data) {
  try {
    const buff = dataUriToBuffer(base64data);
    const mediaResponse = await twitterClient.post("media/upload", {
      media_data: buff.toString("base64")
    });
    const tweetResponse = await twitterClient.post("statuses/update", {
      status: "canvas",
      media_ids: mediaResponse.media_id_string
    });
    return tweetResponse.entities.media[0].media_url.replace(
      "http://",
      "https://"
    );
  } catch (err) {
    throw new VError(err, "Uploading the image to Twitter has failed.");
  }
}

app.get("/", (req, res) => {
  res.send(`memsize=${cache.memsize()}`);
});

app.get("/v1/:username", async (req, res, next) => {
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
    next(new VError(err, "Visiting the profile has failed."));
  }
});

app.post("/v1/tweetMedia", (req, res, next) => {
  const { image } = req.body;

  if (typeof image !== "string") {
    return next(new VError("No valid image uri has been specified"));
  }

  getMediaUrl(image)
    .then(mediaUrl =>
      res.json({
        mediaUrl
      })
    )
    .catch(next);
});

app.use((err, req, res, next) => {
  res.status(500).send({
    error: err.message
  });
});

app.listen(8080, () => {
  console.log("Server started.");
});
