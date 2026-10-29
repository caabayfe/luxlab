// Starts AI agents for the Daily Briefing. The sn_aia runtime rejects calls made from module code
// (its package-private DAOs see the module as an out-of-scope caller), so the call is made from this classic script.
var LuxLabAgentRuntime = Class.create();

LuxLabAgentRuntime.prototype = {
    initialize: function () {},

    start: function (request) {
        return new sn_aia.AiAgentRuntimeUtil().startAiAgentConversation(request);
    },

    type: 'LuxLabAgentRuntime',
};
