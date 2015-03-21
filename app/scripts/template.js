angular.module('unchatbar-connection').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-connection/dialer.html',
    "<div data-ng-init=\"init()\">\n" +
    "    <div ng-show=\"peerId\">\n" +
    "        <form ng-submit=\"connect()\">\n" +
    "            <div class=\"input-group dialer\">\n" +
    "                <input type=\"text\" class=\"form-control\" data-ng-model=\"connectId\" placeholder=\"Username\">\n" +
    "\n" +
    "                <div data-ng-click=\"connect()\" class=\"input-group-addon\">\n" +
    "                    <i class=\"fa fa-check fa-1x\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
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
    "<div class=\"login\">\n" +
    "    <div data-ng-show=\"!peerIdFromStorage\">\n" +
    "        <div class=\"page-header\">\n" +
    "            <h2>Please sign in</h2>\n" +
    "        </div>\n" +
    "        <form>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"sr-only\" for=\"input-message\">Your phone number</label>\n" +
    "\n" +
    "                <div class=\"input-group\">\n" +
    "                    <input type=\"text\"\n" +
    "                           data-ng-model=\"newPeerId\"\n" +
    "                           class=\"form-control input-lg\" id=\"input-message\" placeholder=\"Enter your phone number\"\n" +
    "                           autocomplete=\"off\">\n" +
    "          <span class=\"input-group-btn\">\n" +
    "            <div ui-sref=\"chat\" class=\"btn btn-primary btn-lg\" data-ng-click=\"login();\">\n" +
    "                <i class=\"fa fa-sign-in\"></i>\n" +
    "            </div>\n" +
    "          </span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('views/unchatbar-connection/peerId.html',
    "<div data-ng-init=\"init()\">{{peerId}}</div>\n"
  );

}]);
