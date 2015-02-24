angular.module('unchatbar-connection').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-connection/dialer.html',
    "<div data-ng-init=\"init()\">\n" +
    "    <div ng-show=\"peerId\">\n" +
    "        <div class=\"input-group dialer\">\n" +
    "            <input type=\"text\" class=\"form-control\" data-ng-model=\"connectId\" placeholder=\"Username\">\n" +
    "\n" +
    "            <div data-ng-click=\"connect()\" class=\"input-group-addon\">\n" +
    "                <i class=\"fa fa-check fa-1x\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
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
