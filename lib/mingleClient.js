/*jslint white: false, forin: false, node: true, indent: 4 */
(function (module) {
    "use strict";
    var Shred = require("shred"),
        shred = new Shred(),
        debug = require("./debug"),
        cookies = [];

    function Client(url, auth) {
        this.url = url;
        this.auth = auth;
    }

    Client.prototype.getIndexPage = function (cb) {
        var self = this;
        // no cookies its our first time in.
        if (cookies.length === 0) {
            getIndex(self.url, function (aResponse) {
                    if (aResponse) {
                        cookies = aResponse._headers["Set-Cookie"];
                        getIndexLogin(self.auth, self.url, function(index) {
                            if (index){
                                debug("√ Got index");
                                return cb(index);
                            } else {
                                cb(new Error("no index"));
                            }
                        });
                    } else {
                        cb(new Error("aResponse not there"));
                    }
                }
            );

        } else {
            return getIndex(self.url, function(index) {
                if (index){
                    return index;
                } else {
                    cb(new Error("no index"));
                }
            });
        }
    };

    function getIndex(url, cb) {

        shred.get({
            url:url,
            headers:{
                accept:"text/html"
            },
            on:{
                200:function (response) {
                    debug("√ Got API description as HTML");
                    if (response) {
                        cb(response);
                    } else {
                        return cb(new Error("Response is undefined."))
                    }
                },
                response:function (response) {
                    return cb(new Error("We got something besides a 200 response!"));
                }
            }
        });
    }

    function getIndexLogin(auth, url, cb) {

        var cookie = cookies[0].toString(),
            urlPath = url +"profile/login",
            content = "user%5Blogin%5D=" + auth.userName +
                "&user%5Bpassword%5D=" + auth.password + "&commit=Sign+in+%C2%BB";;

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
                    debug("√ Got HomePage as HTML");
                    return cb(response);

                },
                response:function (response) {
                    return cb(new Error("fail"));
                }
            }

        });

    }

    module.exports = function (url, auth) {
        debug("url: ", url);
        debug("auth user: ", auth.userName );
        return new Client(url, auth);
    };

})(module);