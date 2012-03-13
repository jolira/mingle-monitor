/*jslint white: false, forin: false, node: true, indent: 4 */
(function (module) {
    var mingleClient = require("./mingleClient"),
        jsdom = require('jsdom'),
        debug = require("./debug");

    //TODO: Load auth.
    var auth = {userName:"gabe", password:"tester"};

    function Monitor(path) {
        this.server = path;
    }

    module.exports = function (server) {
        return new Monitor(server);
    }

    Monitor.prototype.start = function () {
        self = this;
        self.client = mingleClient(this.server, auth);
        self.client.getIndexPage(function (response) {
            if (response) {

                getProjects(response.content.body, function (theProjects) {
                    for (var i in theProjects) {
                        self.client.getPage(theProjects[i], function (page) {
                            //console.log(page.content.body);
                        });
                    }
                });
            }
        });
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