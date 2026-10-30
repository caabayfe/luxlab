// Bridge for scripts that cannot import modules: the Replay AI skills' tool, the Replay Analyst agent's tools
// and the incident form buttons
var LuxLabReplayAI = Class.create();

// Same <scope>/<package>/<version>/<source path> form the SDK generates for REST routes; follow package.json's version
var LUXLAB_MODULES = 'x_everi_luxlab/luxlab/0.0.1/src/server/replay/';

LuxLabReplayAI.prototype = {
    initialize: function () {
        this._context = require(LUXLAB_MODULES + 'ai-context.ts');
        this._forms = require(LUXLAB_MODULES + 'form-actions.ts');
        this._ai = require(LUXLAB_MODULES + 'ai.ts');
    },

    // Data tool of both Replay AI skills
    getContext: function (incidentNumber) {
        return this._context.replayContext(String(incidentNumber || ''));
    },

    // Save tools of the LuxLab Replay Analyst agent
    saveReview: function (incidentNumber, review) {
        return this._ai.saveReview(String(incidentNumber || ''), String(review || ''));
    },

    saveFollowUps: function (incidentNumber, followUpsJson) {
        return this._ai.saveFollowUps(String(incidentNumber || ''), String(followUpsJson || ''));
    },

    // Incident form buttons: run the skill, save the result on the replay, return an HTML message
    reviewMessage: function (incidentId) {
        return this._forms.reviewMessage(String(incidentId));
    },

    followUpsMessage: function (incidentId) {
        return this._forms.followUpsMessage(String(incidentId));
    },

    type: 'LuxLabReplayAI',
};
