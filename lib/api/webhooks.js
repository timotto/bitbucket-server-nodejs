'use strict';

module.exports = function (client) {
  return {
    get: function (projectKey, repoSlug, options) {
      return client.getCollection('projects/' + projectKey + '/repos/' + repoSlug + '/webhooks', options);
    },

    getWebhook: function (projectKey, repoSlug, webhookId, options) {
      return client.get('projects/' + projectKey + '/repos/' + repoSlug + '/webhooks/' + webhookId, options);
    },

    deleteWebhook: function (projectKey, repoSlug, webhookId, options) {
      return client.delete('projects/' + projectKey + '/repos/' + repoSlug + '/webhooks/' + webhookId, options);
    },

    createWebhook: function (projectKey, repoSlug, webhookDetails) {
        var path = 'projects/' + projectKey + '/repos/' + repoSlug + '/webhooks';
        return client.put(path, webhookDetails);
    }
  }
};
