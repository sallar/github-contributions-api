const express = require("express");
const bodyParser = require("body-parser");
const cache = require("memory-cache");
const cors = require("cors");
const VError = require("verror").WError;
const { twitter, alerts, fetchDataForAllYears } = require("./utils");

const app = express();

app.use(cors());
app.use(
  bodyParser.json({
    limit: "1mb"
  })
);

twitter.createClient();

app.get("/", (req, res) => {
  res.send(`memsize=${cache.memsize()}`);
});

app.get("/v1/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const { format } = req.query;
    const key = `${username}-${format}`;
    const cached = cache.get(key);
    if (cached !== null) {
      return res.json(cached);
    }
    const data = await fetchDataForAllYears(username, format);
    cache.put(key, data, 1000 * 3600); // Store for an hour
    res.json(data);
  } catch (err) {
    next(new VError(err, alerts.error.profileDisabled));
  }
});

app.post("/v1/tweetMedia", (req, res, next) => {
  const { image } = req.body;

  if (typeof image !== "string") {
    return next(new VError(alerts.error.imageInvalid));
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

app.listen(8080, () => console.log(alerts.success.serverOn));
