angular.module('unchatbar-connection').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-connection/dialer.html',
    "<div data-ng-init=\"init()\">\n" +
    "    <div ng-show=\"peerId\">\n" +
    "        <form ng-submit=\"connect()\">\n" +
    "        <div class=\"input-group dialer\">\n" +
    "            <input type=\"text\" class=\"form-control\" data-ng-model=\"connectId\" placeholder=\"Username\">\n" +
    "\n" +
    "            <div data-ng-click=\"connect()\" class=\"input-group-addon\">\n" +
    "                <i class=\"fa fa-check fa-1x\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/unchatbar-connection/failed-login.html',
    "<div class=\"modal-header\" data-ng-init=\"init()\">\n" +
    "    <h3 class=\"modal-title\">Login Failed!</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"alert alert-info\" role=\"alert\">The phone-number exists. Please choose another phone-number.\n" +
    "        <br/>\n" +
    "        If this this phone-number is yours, please insert the correct password.\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"pass\">Password</label>\n" +
    "            <input type=\"text\" required=\"true\" class=\"form-control\"\n" +
    "                   id=\"pass\" data-ng-model=\"pass\" placeholder=\"Enter your password\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"update()\">save new password</button>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('views/unchatbar-connection/login.html',
    "<div >\n" +
    "    <div ng-show=\"!peerIdFromStorage\">\n" +
    "        <form class=\"form-signin\">\n" +
    "            <h2 class=\"form-signin-heading\">Please sign in</h2>\n" +
    "            <label for=\"peerId\" class=\"sr-only\">your Phonenumber</label>\n" +
    "            <input type=\"text\" id=\"peerId\" class=\"form-control\"\n" +
    "                   data-ng-model=\"newPeerId\"\n" +
    "                   placeholder=\"Username\" required autofocus>\n" +
    "            <button class=\"btn btn-lg btn-primary btn-block\"\n" +
    "                    data-ng-click=\"login();\">Sign in\n" +
    "            </button>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('views/unchatbar-connection/peerId.html',
    "<div data-ng-init=\"init()\">{{peerId}}</div>\n"
  );

}]);
