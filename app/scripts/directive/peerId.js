'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar-connection.directive:unConnectionPeerID
 * @restrict E
 * @description
 *
 * build client connection
 *
 */

angular.module('unchatbar-connection').directive('unConnectionPeerId', [
    function ( ) {
        return {
            restrict: 'E',
            templateUrl: 'views/unchatbar-connection/peerId.html',
            controller: 'dialer',
            transclude: true,
            link : function(scope){
                scope.$on('BrokerPeerOpen', function () {
                    scope.getPeerId();
                });
                scope.getPeerId();
            }
        };
    }
]);
