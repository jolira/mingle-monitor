/*jslint white: false, forin: false, node: true, indent: 4 */
(function (module) {
    var mingleClient = require("./mingleClient"),
        jsdom = require('jsdom'),
        debug = require("./debug"),
        isMonitorOn = false, server, conf;

    function Monitor(url, config) {
        server = url;
        conf = config;
    }

    module.exports = function (url, config) {
        return new Monitor(url, config);
    }

    Monitor.prototype.start = function () {
        isMonitorOn = true;
        runMonitor();
        if (conf.interval) {
            setInterval(runMonitor, conf.interval);
        }
    }

    Monitor.prototype.stop = function () {
        isMonitorOn = false;
    }

    function runMonitor() {
        if (isMonitorOn) {
            var client = mingleClient(server, conf);
            client.getIndexPage(function (response, data) {
                if (response) {

                    getProjects(response.content.body, function (theProjects) {
                        for (var i in theProjects) {
                            client.getPage(theProjects[i], function (page, data) {
                                debug('data', data);
                            });
                        }
                    });
                }
            });
        }

    }

    function getProjects(indexPage, cb) {

        //TODO: including jquery is slow.
        jsdom.env(indexPage, [
            'http://code.jquery.com/jquery-1.5.min.js'
        ],
            function (errors, window) {
                var $ = window.jQuery,
                    projectList = [];

                debug("We have", $("div.projects_list div.project").size() + " project(s).");

                var projectDesc = $("div.project-description a");

                projectDesc.each(function (index) {
                    var projectName = $(this).attr("href");
                    if (projectName.indexOf("/projects/") === 0) {
                        debug(index, projectName)
                        projectList.push(projectName);
                    }
                });
                cb(projectList);
            });
    }

}(module));