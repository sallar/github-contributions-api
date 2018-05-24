const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const sandbox = sinon.createSandbox();
const nodeFetch = sandbox.stub();
const fetchDataForAllYears = proxyquire('../fetch_data_for_all_years', {
  'node-fetch': nodeFetch,
});

describe('fetchDataForAllYears', () => {
  def('format', undefined);
  def('username', 'didericis');
  subject(() => fetchDataForAllYears($username, $format));

  const stubFetch = (url, filename) => {
    nodeFetch.withArgs(`https://github.com${url}`).returns({ 
      text: sandbox.stub().returns(
        fs.readFileSync(path.resolve(__dirname, 'html', filename))
      ) 
    });
  }

  beforeEach(() => {
    stubFetch('/didericis', 'didericis.html');
    stubFetch('/Didericis?tab=overview&from=2018-05-01&to=2018-05-21', 'didericis-2018.html');
    stubFetch('/Didericis?tab=overview&from=2017-12-01&to=2017-12-31', 'didericis-2017.html');
    stubFetch('/Didericis?tab=overview&from=2016-12-01&to=2016-12-31', 'didericis-2016.html');
    stubFetch('/Didericis?tab=overview&from=2015-12-01&to=2015-12-31', 'didericis-2015.html');
    stubFetch('/Didericis?tab=overview&from=2014-12-01&to=2014-12-31', 'didericis-2014.html');
  });

  afterEach(() => {
    sandbox.restore();
  });

  context('when the format is not set', () => {
    def('format', undefined);

    it('returns data in a flat format', async () => {
      expect(await $subject).to.eql(require('./expectations/flat.json'));
    });
  });

  context('when the format is set to nested', () => {
    def('format', 'nested');

    it('returns the data in a nested format', async () => {
      expect(await $subject).to.eql(require('./expectations/nested.json'));
    });
  });
});
