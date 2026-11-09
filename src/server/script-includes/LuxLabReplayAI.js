// Bridge for scripts that cannot import modules: the Replay AI skills' tool, the Replay and Pattern Analyst agents' tools,
// the incident form buttons, the response patterns job and the live coach job
var LuxLabReplayAI = Class.create();

// Same <scope>/<package>/<version>/<source path> form the SDK generates for REST routes; follow package.json's version
var LUXLAB_MODULES = 'x_everi_luxlab/luxlab/0.0.1/src/server/replay/';
var LUXLAB_COACH = 'x_everi_luxlab/luxlab/0.0.1/src/server/coach/coach.ts';

LuxLabReplayAI.prototype = {
    initialize: function () {
        this._context = require(LUXLAB_MODULES + 'ai-context.ts');
        this._forms = require(LUXLAB_MODULES + 'form-actions.ts');
        this._ai = require(LUXLAB_MODULES + 'ai.ts');
        this._patternAi = require(LUXLAB_MODULES + 'pattern-ai.ts');
    },

    // Data tool of both Replay AI skills
    getContext: function (incidentNumber) {
        return this._context.replayContext(String(incidentNumber || ''));
    },

    // Language tool of the Comms Drafter: the language the incident's customers read
    getLanguage: function (incidentNumber) {
        return require(LUXLAB_MODULES + 'language.ts').incidentLanguageOf(String(incidentNumber || ''));
    },

    // Save tools of the LuxLab Replay Analyst agent
    saveReview: function (incidentNumber, review) {
        return this._ai.saveReview(String(incidentNumber || ''), String(review || ''));
    },

    saveFollowUps: function (incidentNumber, followUpsJson) {
        return this._ai.saveFollowUps(String(incidentNumber || ''), String(followUpsJson || ''));
    },

    // Tools of the LuxLab Pattern Analyst agent
    getPatternContext: function (patternId) {
        return this._patternAi.patternContext(String(patternId || ''));
    },

    savePatternProposal: function (patternId, fixType, proposal) {
        return this._patternAi.savePatternProposal(String(patternId || ''), String(fixType || ''), String(proposal || ''));
    },

    // Nightly response patterns job: replay what is missing for up to maxMs, then mine
    refreshPatterns: function (maxMs) {
        return require(LUXLAB_MODULES + 'patterns.ts').refreshPatterns(maxMs);
    },

    // Live coach job: post the due nudges as work notes; returns how many were posted
    refreshNudges: function () {
        return require(LUXLAB_COACH).refreshNudges();
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
