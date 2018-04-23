var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Webhooks', function () {
  var requestDelete, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function () {
    bitbucketClient = new BitbucketClient('http://localhost', oauth);
    requestDelete = sinon.stub(request, 'delete');
  });

  afterEach(function () {
    requestDelete.restore();
  });

  it('should delete a single webhook', function (done) {
    // Mock the HTTP Client delete.
    requestDelete.returns(Promise.resolve({"not":"in spec"}));

    // Test hooks.get API.
    var webhookId = 'expected-id';
    bitbucketClient.webhooks.deleteWebhook('PRJ', 'my-repo', webhookId)
      .then(function (hook) {
        assert.equal(
          requestDelete.getCall(0).args[ 0 ].uri,
          'http://localhost/projects/PRJ/repos/my-repo/webhooks/' + webhookId
        );

        done();
      });
  });
});
