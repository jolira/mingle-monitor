/*jslint white: false, forin: false, node: true, indent: 4 */
(function () {
    "use strict";

    var fs = require('fs');

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

        console.error("Please specify a MINGLE_SERVER environment variable.");
        process.exit(-2);
    }

    function getConfig(){
        var fileContents = fs.readFileSync('./conf/monitor-config.json','utf8');
        return JSON.parse(fileContents);
    }

    var mingleMonitor = require('./lib/monitor');
    var config = getConfig();
    var monitor = mingleMonitor(getServer(), config);
    monitor.start();


})();
