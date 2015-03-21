angular.module('unchatbar-connection').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-connection/dialer.html',
    "<div class=\"un-connect-dialer\" data-ng-init=\"init()\" data-ng-show=\"peerId\">\n" +
    "    <form ng-submit=\"connect()\" class=\"form-group\">\n" +
    "        <label for=\"input-add\" class=\"sr-only\">Add user</label>\n" +
    "        <div class=\"input-group\">\n" +
    "            <input type=\"text\" data-ng-model=\"connectId\" autocomplete=\"off\" placeholder=\"Enter user name\" id=\"input-add\"\n" +
    "                   class=\"form-control input-sm\">\n" +
    "            <span class=\"input-group-btn\">\n" +
    "              <button class=\"btn btn-success btn-sm un-connect-button-login\" type=\"button\" data-ng-click=\"connect()\"><i class=\"fa fa-plus\"></i>\n" +
    "              </button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </form>\n" +
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
    "    <div data-ng-show=\"!peerId\">\n" +
    "        <div class=\"page-header\">\n" +
    "            <h2>Please sign in</h2>\n" +
    "        </div>\n" +
    "        <form class=\"form-group\">\n" +
    "            <label class=\"sr-only\" for=\"input-message\">Your phone number</label>\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\"\n" +
    "                       data-ng-model=\"newPeerId\"\n" +
    "                       class=\"form-control input-lg\" id=\"input-message\" placeholder=\"Enter your phone number\"\n" +
    "                       autocomplete=\"off\">\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                    <div ui-sref=\"chat\" class=\"btn btn-primary btn-lg\" data-ng-click=\"login();\">\n" +
    "                        <i class=\"fa fa-sign-in\"></i>\n" +
    "                    </div>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
