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
            templateUrl: function(element,scope){
                return scope.customTemplateUrl || 'views/unchatbar-connection/login.html';
            },
            scope : {
                customTemplateUrl: '@'
            },
            controller: 'dialer',
            transclude: true
        };
    }
]);
