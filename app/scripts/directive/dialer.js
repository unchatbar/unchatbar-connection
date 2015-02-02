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

angular.module('unchatbar-connection').directive('dialer', [
    function ( ) {
        return {
            restrict: 'E',
            templateUrl: 'views/unchatbar-connection/dialer.html',
            controller: 'dialer'
        };
    }
]);
