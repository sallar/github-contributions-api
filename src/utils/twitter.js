const Twitter = require("twitter");
const VError = require("verror").WError;
const dataUriToBuffer = require("data-uri-to-buffer");

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = alerts =>
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
      throw new VError(err, alerts.error.imageUploadFailed);
    }
  };
