var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Webhooks', function () {
  var requestPost, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function () {
    bitbucketClient = new BitbucketClient('http://localhost', oauth);
    requestPost = sinon.stub(request, 'post');
  });

  afterEach(function () {
    requestPost.restore();
  });

  it('should create webhooks', function (done) {
    // Mock the HTTP Client get.
    var expected = require('../mocks/webhooks.json');
    requestPost.returns(Promise.resolve(expected));

    var webhookDetails = {
      "id": 10,
      "name": "Webhook Name",
      "createdDate": 1513106011000,
      "updatedDate": 1513106011000,
      "events":["repo:refs_changed","repo:modified"],
      "configuration":{"secret":"password"},
      "url":"http://example.com",
      "active":true
    };

    // Test hooks.get API.
    bitbucketClient.webhooks.createWebhook('projectKey', 'repoSlug', webhookDetails)
      .then(function (hooks) {
        assert.equal(
          requestPost.getCall(0).args[ 0 ].uri,
          'http://localhost/projects/projectKey/repos/repoSlug/webhooks'
        );
        assert.equal(requestPost.getCall(0).args[ 0 ].body, webhookDetails);

        done();
      });
  });
});
