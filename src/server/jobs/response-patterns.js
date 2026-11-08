(function () {
    // Up to 30 minutes of replaying, then the patterns are mined from everything replayed so far
    var count = new x_everi_luxlab.LuxLabReplayAI().refreshPatterns(30 * 60 * 1000);
    gs.info('LuxLab response patterns mined: ' + count);
})();
