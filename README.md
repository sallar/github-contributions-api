# Github Contributions API

A simple API that returns number of Github contributions based on a users Github profile.

## Usage

Send a request to the API in the following format:

```
https://github-contributions.now.sh/v1/GITHUB_USERNAME
```

and you will receive an object with history of that user's contributions:

```json
{
  "2017-04-23": 7,
  "2017-04-24": 9,
  "2017-04-25": 19,
  "2017-04-26": 14,
  "2017-04-27": 17,
  "2017-04-28": 11,
  "2017-04-29": 11,
  "2017-04-30": 16,
  "2017-05-01": 4,
  "2017-05-02": 26,
  ...
}
```

## License

MIT © [Sallar Kaboli](LICENSE)
