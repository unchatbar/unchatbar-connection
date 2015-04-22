angular.module('unchatbar-connection').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-connection/dialer.html',
    "<div class=\"un-connect-dialer\" data-ng-init=\"init()\" data-ng-show=\"peerId\">\n" +
    "    <form ng-submit=\"connect()\">\n" +
    "        <label for=\"input-add\" translate>Add user</label>\n" +
    "        <div class=\"un-connect-dialer-input-group\">\n" +
    "            <input type=\"text\" data-ng-model=\"connectId\" autocomplete=\"off\" placeholder=\"{{'Enter user name'|translate}}\" id=\"input-add\"\n" +
    "                   class=\"\" required=\"true\">\n" +
    "            <span class=\"button-group\">\n" +
    "              <button data-ng-disabled=\"!connectId\"\n" +
    "                      type=\"button\" data-ng-click=\"connect()\">\n" +
    "                  <i></i>\n" +
    "              </button>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('views/unchatbar-connection/failed-login.html',
    "<div class=\"modal-header\" data-ng-init=\"init()\">\n" +
    "    <h3 class=\"modal-title\" translate>Login Failed!</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"alert alert-info\" role=\"alert\" translate>The phone-number exists. Please choose another phone-number.\n" +
    "        <br/>\n" +
    "        If this this phone-number is yours, please insert the correct password.\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"pass\" translate>Password</label>\n" +
    "            <input type=\"text\" required=\"true\" class=\"form-control\"\n" +
    "                   id=\"pass\" data-ng-model=\"pass\" placeholder=\"{{'Enter your password'|translate}}\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"update()\" translate>save new password</button>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\" translate>Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('views/unchatbar-connection/login.html',
    "<div class=\"login\">\n" +
    "    <div data-ng-show=\"!peerId\">\n" +
    "        <div class=\"login-header\">\n" +
    "            <h2 translate>Please sign in</h2>\n" +
    "        </div>\n" +
    "        <div class=\"login-body\">\n" +
    "            <form data-ng-submit=\"login()\" name=\"loginForm\">\n" +
    "                <label for=\"input-message\" translate>Your phone number</label>\n" +
    "\n" +
    "                <div class=\"login-group\">\n" +
    "                    <input type=\"text\"\n" +
    "                           data-ng-model=\"newPeerId\"\n" +
    "                           required=\"true\"\n" +
    "                           name=\"newPeerId\"\n" +
    "                           data-ng-pattern=\"/^[a-zA-Z0-9]*$/\"\n" +
    "                           id=\"input-message\" placeholder=\"{{'Enter your phone number' | translate}}\"\n" +
    "                           autocomplete=\"off\">\n" +
    "\n" +
    "\n" +
    "                <span class=\"login-group-button\">\n" +
    "                    <div class=\"login-button\" data-ng-class=\"{'active' : newPeerId,'deactivate' : !newPeerId}\"\n" +
    "                         data-ng-click=\"login();\">\n" +
    "                        <i></i>\n" +
    "                    </div>\n" +
    "                </span>\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-danger\" ng-show=\"loginForm.newPeerId.$error.pattern\" translate>\n" +
    "                    only Words/Numbers are allowed\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
