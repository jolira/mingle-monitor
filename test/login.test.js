/**
 * Created by JetBrains WebStorm.
 * User: gabe
 * Date: 3/8/12
 * Time: 2:18 PM
 * To change this template use File | Settings | File Templates.
 */

process.env.MINGLE_SERVER = "http://localhost:8080";

var login = require('../lib/login'),
    //connect = require("connect"),
    //assert = require('assert'),
    testCase = require('nodeunit').testCase,
    Shred = require("shred"),
    LOGIN_PAGE = 'http://localhost:8080/';

exports.login = testCase({

    'successful login':function (test) {

        var shredit = new Shred;

        var _login = login(shredit, LOGIN_PAGE);
        _login.getLoginPage();
        _login.getProjectList();
    }

});