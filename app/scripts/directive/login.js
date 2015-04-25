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

angular.module('unchatbar-connection').directive('unConnectionAuthentication', [
    function ( ) {
        return {
            restrict: 'E',
            templateUrl: function(element){
                return element.attr('data-custom-template-url') || 'views/unchatbar-connection/login.html';
            },
            controller: 'dialer',
            transclude: true
        };
    }
]);
