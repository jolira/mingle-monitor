/*jslint white: false, forin: false, node: true, indent: 4 */
(function (module) {
    "use strict";
    var Shred = require("shred"),
        shred = new Shred(),
        debug = require("./debug"),
        cookies = [];

    function Client(url, config) {
        this.url = url;
        this.conf = config;
        //cookies = [];
    }

    Client.prototype.getPage = function (page, cb) {
        var self = this;

        //remove leading slash
        var pg = page.replace(/^\/|\/$/g, '');
        var uri = self.url + pg;

        getIndex(uri, function (aResponse, loadTime) {
            if (aResponse) {
                cookies = aResponse._headers["Set-Cookie"];
                return cb(aResponse, loadTime);
            }
        });
    }

    Client.prototype.getIndexPage = function (cb) {
        var self = this;
        // no cookies its our first time in.
        if (cookies.length === 0) {
            getIndex(self.url, function (aResponse) {
                    if (aResponse) {
                        cookies = aResponse._headers["Set-Cookie"];
                        getIndexLogin(self.conf, self.url, getIndexCB(cb));
                    } else {
                        cb(new Error("No response for page:", self.url), undefined);
                    }
                }
            );

        } else {
            return getIndex(self.url, getIndexCB(cb));
        }
    };

    function getIndexCB(cb){
        return function(index, data) {
            if (index){
                debug("√ Got index");
                return cb(index, data);
            } else {
                cb(new Error("No response for page:", self.url), undefined);
            }
        };
    }
    function getIndex(url, cb) {

        var cookie = (cookies.length>0)?cookies[0].toString():"";

        var start = new Date().getTime();
        shred.get({
            url:url,
            headers:{
                accept:"text/html",
                cookie: cookie
            },
            on:{
                200:function (response) {
                    if (response) {
                        return success(response, start, url, cb);
                    } else {
                        return cb(new Error("Response is undefined."), undefined)
                    }
                },
                response:function (response) {
                    return cb(new Error("We got something besides a 200 response!"), undefined);
                }
            }
        });
    }

    function getIndexLogin(conf, url, cb) {

        var cookie = cookies[0].toString(),
            urlPath = url +"profile/login",
            content = "user%5Blogin%5D=" + conf.userName +
                "&user%5Bpassword%5D=" + conf.password + "&commit=Sign+in+%C2%BB";;
        var start = new Date().getTime();
        shred.post({
            url: urlPath,
            headers:{
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                content_type: "application/x-www-form-urlencoded",
                cookie: cookie
            },
            content:content,
            on:{
                success:function (response) {
                    return success(response, start, urlPath, cb);
                },
                response:function (response) {
                    return cb(new Error("fail"), undefined);
                }
            }
        });
    }

    function success(response, start, urlPath, cb) {
        var stop = new Date().getTime();
        var data = {};
        data.loadTime = stop - start;
        data.startTime = start;
        data.stopTime = stop;
        data.urlPath = urlPath;
        return cb(response, data);
    }

    module.exports = function (url, conf) {
        debug("url: ", url);
        debug("user: ", conf.userName );
        return new Client(url, conf);
    };

})(module);