/**
 * Created by JetBrains WebStorm.
 * User: gabe
 * Date: 3/9/12
 * Time: 10:02 AM
 * To change this template use File | Settings | File Templates.
 */

var assert = require('assert'),
    testCase = require('nodeunit').testCase,
    mingleClient = require('../lib/mingleClient'),
    INDEX_PAGE = 'http://mingle.local.com:8080/',
    auth = {userName:"gabe", password:"tester"},
    client = mingleClient(INDEX_PAGE, auth);

exports.getIndex = testCase({

    'success':function (test) {

        getIndex();

    }

});
function getIndex() {

    client.getIndexPage(function (response) {
        if (response) {
            var body = response.content.body;
            assert(response);
            console.log("√ Got response");
        } else {
            console.log("no response");
        }
    });

}

//getIndex();

