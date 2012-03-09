/*jslint white: false, forin: false, node: true, indent: 4 */
(function (module) {
    "use strict";

    // form ids for login page
    // profile/login
    // user_login
    // user_password

    //var resources, schema;

    function Login(shred, url) {
        this.shred = shred;
        this.url = url;
    }

    //add callback
    Login.prototype.getLoginPage = function () {
        var self = this;

        self.shred.get({
            url:self.url,
            headers:{
                accept:"text/html"
            },
            on:{
                200:function (response) {
                    //assert.ok(response.content.body);
                    console.log("√ Got API description as HTML");
                    //console.log(response.content.body);
                    var body = response.content.body;
                    //console.log(body);

                },
                response:function (response) {
                    console.log("We got something besides a 200 response!")
                }
            }
        });
    };

    Login.prototype.getProjectList = function () {

        var self = this;
        self.shred.post({
            url: "http://localhost:8080/profile/login",
            //need to add cookies to header
            headers: {
                accept: "text/html",
                content_type: "application/json"},
            content: {user_login: "gabe", user_password:"tester"},
            on:
            {
                success: function(response){
                    console.log("√ Got API description as HTML");
                    //console.log(response.content.body);
                    var body = response.content.body;
                    console.log(body);

                },
                response: function(response){
                    console.log("fail");
                }
            }

        });

    }

    module.exports = function (shred, url) {
        return new Login(shred, url);
    };

})(module);