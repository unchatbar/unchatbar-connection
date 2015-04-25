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
            templateUrl: function(element,scope){
                return scope.customTemplateUrl || 'views/unchatbar-connection/dialer.html';
            },
            controller: 'dialer',
            transclude: true,
            scope : {
                customTemplateUrl: '@'
            },
            link : function(scope){
                scope.$on('BrokerPeerOpen', function () {
                    scope.getPeerId();
                });
                scope.getPeerId();
            }
        };
    }
]);
