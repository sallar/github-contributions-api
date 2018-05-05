# :octocat: Github Contributions API [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sallar/github-contributions-canvas/blob/master/LICENSE)

A simple API that returns number of Github contributions based on a users Github profile. This API is used for generating an image of user contributions [in this site](https://github-contributions.now.sh/)

## How to run

Install the packages using [NPM](https://nodejs.org/en/):
```
$ npm install ./github-contributions-api
```
Or [download as ZIP](https://github.com/sallar/github-contributions-api/archive/master.zip).

## Example

Send a request to the API in the following format:

```
https://github-contributions-api.now.sh/v1/GITHUB_USERNAME
```

And you will receive an object with history of that user's contributions:

```json
{
  ...
  "contributions": [
    {
      "date": "2018-04-30",
      "count": 2,
      "color": "#c6e48b"
    },
    {
      "date": "2018-04-29",
      "count": 29,
      "color": "#239a3b"
    },
    ...
  ]
}
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Changelog

Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/sallar/github-contributions-api/releases) page.

## License

[MIT license](LICENSE) © Sallar Kaboli
