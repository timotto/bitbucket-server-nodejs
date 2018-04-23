var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Webhooks', function () {
  var requestGet, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function () {
    bitbucketClient = new BitbucketClient('http://localhost', oauth);
    requestGet = sinon.stub(request, 'get');
  });

  afterEach(function () {
    requestGet.restore();
  });

  it('should get list of webhooks', function (done) {
    // Mock the HTTP Client get.
    var expected = require('../mocks/webhooks.json');
    requestGet.returns(Promise.resolve(expected));

    // Test hooks.get API.
    bitbucketClient.webhooks.get('PRJ', 'my-repo')
      .then(function (hooks) {
        assert.equal(hooks.size, 1);
        assert.deepEqual(hooks.values[ 0 ], expected.values[ 0 ]);
        assert.equal(
          requestGet.getCall(0).args[ 0 ].uri,
          'http://localhost/projects/PRJ/repos/my-repo/webhooks?limit=1000'
        );

        done();
      });
  });

  it('should get a single webhook', function (done) {
    // Mock the HTTP Client get.
    var expected = require('../mocks/webhook-single.json');
    requestGet.returns(Promise.resolve(expected));

    // Test hooks.get API.
    var webhookId = 'expected-id';
    bitbucketClient.webhooks.getWebhook('PRJ', 'my-repo', webhookId)
      .then(function (hook) {
        assert.deepEqual(hook.details, expected.details);
        assert.equal(
          requestGet.getCall(0).args[ 0 ].uri,
          'http://localhost/projects/PRJ/repos/my-repo/webhooks/' + webhookId
        );

        done();
      });
  });
});
