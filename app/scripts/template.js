angular.module('unchatbar-connection').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/unchatbar-connection/dialer.html',
    "<div ng-show=peerId><div class=\"input-group dialer\"><input class=form-control data-ng-model=connectId placeholder=Username><div data-ng-click=connect() class=input-group-addon><i class=\"fa fa-check fa-1x\"></i></div></div></div>"
  );

}]);
