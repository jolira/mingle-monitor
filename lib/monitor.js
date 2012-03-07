(function (module) {
    "use strict";

    var debug = require("./debug");
    var shred = require("shred");

    module.exports = function(server) {
        debug("monitoring", server);

        var req = shred.get({
            url: "http://api.spire.io/",
            headers: {
                Accept: "application/json"
            },
            on: {
                // You can use response codes as events
                200: function(response) {
                    // Shred will automatically JSON-decode response bodies that have a
                    // JSON Content-Type
                    console.log(response.content.data);
                },
                // Any other response means something's wrong
                response: function(response) {
                    console.log("Oh no!");
                }
            }
        });
    };
})(module);
