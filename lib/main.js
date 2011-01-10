
const chirpradio = require('chirpradio');

exports.main = function (options, callback) {
    // options.reason =
    //      "install", "enable", "startup", "upgrade", or "downgrade"
    chirpradio.startup();
};

exports.onUnload = function (reason) {
    // reason = "uninstall", "disable", "shutdown", "upgrade", or "downgrade"
};
