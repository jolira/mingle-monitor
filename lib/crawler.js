/*jslint white: false, forin: false, node: true, indent: 4 */
(function (module) {
    var mingleClient = require("./mingleClient"),
        jsdom = require('jsdom'),
        debug = require("./debug");

    //TODO: Load index page and auth.
    var INDEX_PAGE = 'http://mingle.local.com:8080/',
        auth = {userName:"gabe", password:"tester"},
        client = mingleClient(INDEX_PAGE, auth);

    client.getIndexPage(function (response) {
        if (response) {

            getProjects(response.content.body, function (theProjects) {
                for (var i in theProjects) {
                    client.getPage(theProjects[i], function(page){
                       //console.log(page.content.body);
                    });
                }
            });
        }
    });

//    function getProjects(indexPage, cb) {
////     $ = require 'jquery'
//    var projectList =[];
//     $('body').append(indexPage);
//     console.log($("body").html());
//        cb(projectList);
//    }

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
                    var addressValue = $(this).attr("href");
                    if (addressValue.indexOf("/projects/") === 0) {
                        projectList.push(addressValue);
                    }
                });
                cb(projectList);
            });
    }

}(module));