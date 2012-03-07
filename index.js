(function (exports, __dirname) {
    "use strict";

    process.on("uncaughtException", function (err) {
        console.error(err.stack || err);
        process.exit(-1);
    });

    function getServer() {
        if (process.argv.length > 3) {
            return process.argv[3];
        }

        if (process.env.MINGLE_SERVER) {
            return process.env.MINGLE_SERVER;
        }

        console.error("Please specify a MINGLE_SERVER envrionment variable.");
        process.exit(-2);
    }

    var debug = require("./lib/debug"),
        monitor = require('./lib/monitor'),
        server = getServer();

    monitor(server);
})(exports, __dirname);
