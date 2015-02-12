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


  $templateCache.put('views/unchatbar-connection/peerId.html',
    "<div data-ng-init=\"init()\">\n" +
    "    your PeerId: {{peerId}}\n" +
    "</div>\n"
  );

}]);
