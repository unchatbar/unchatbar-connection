'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc directive
 * @name unchatbar-connection.directive:dialer
 * @restrict E
 * @description
 *
 * build client connection
 *
 */

angular.module('unchatbar-connection').directive('unConnectionDialer', [
    function ( ) {
        return {
            restrict: 'E',
            templateUrl: 'views/unchatbar-connection/dialer.html',
            controller: 'dialer',
            link : function(scope){
                /**
                 * @ngdoc methode
                 * @name peerId
                 * @propertyOf unchatbar-connection.directive:dialer
                 * @return {String} peerId from Broker
                 * @description
                 *
                 * client peer id
                 *
                 */
                scope.peerId = '';

                /**
                 * @ngdoc methode
                 * @name getPeerId
                 * @methodOf unchatbar-connection.directive:unConnectionPeerID
                 * @return {String} peerId from Broker
                 * @description
                 *
                 * init
                 *
                 */
                scope.init = function(){
                    scope.peerId = scope.getPeerId();
                };
            }
        };
    }
]);
