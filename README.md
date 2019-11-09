## :warning: [Deprecation Notice]

This repository is now deprecated and the code lives within it's parent project [sallar/github-contributions-chart](https://github.com/sallar/github-contributions-chart) which uses Next.js and serverless functions to run it.

# :octocat: Github Contributions API 

[![GitHub license][license-mit-image]][license-mit-url]
[![Build Status][travis-image]][travis-url] 
[![Dependency Status][daviddm-image]][daviddm-url]

>A simple API that returns number of Github contributions based on a users Github profile. This API is used for generating an image of user contributions [in this site](https://github-contributions.now.sh/)

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

You can return the results as an object keyed by year, month and day by using the `format=nested` query param:

```
https://github-contributions-api.now.sh/v1/GITHUB_USERNAME?format=nested
```

```json
{
  ...
  "contributions": {
     "2018": {
       "4": {
         "29": {
           "date": "2018-04-29",
           "count": 29,
           "color": "#239a3b"
         },
         "30": {
           "date": "2018-04-30",
           "count": 2,
           "color": "#c6e48b"
         }
       },
    },
    ...
  }
}
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Changelog

Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/sallar/github-contributions-api/releases) page.

## License

[MIT license](LICENSE) © Sallar Kaboli

[license-mit-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-mit-url]: https://github.com/sallar/github-contributions-canvas/blob/master/LICENSE
[travis-image]: https://travis-ci.com/sallar/github-contributions-api.svg?branch=master
[travis-url]: https://travis-ci.com/sallar/github-contributions-api
[daviddm-image]: https://david-dm.org/sallar/github-contributions-api.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/sallar/github-contributions-api
