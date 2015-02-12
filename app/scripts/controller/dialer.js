'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar-connection.controller:dialer
 * @require $scope
 * @require $rootScope
 * @require Broker
 * @description
 *
 * build client connection
 *
 */
angular.module('unchatbar-connection').controller('dialer', ['$scope', 'Broker',
    function ($scope, Broker) {

        /**
         * @ngdoc methode
         * @name getPeerId
         * @methodOf unchatbar-connection.controller:dialer
         * @return {String} peerId from Broker
         * @description
         *
         * connect to client
         *
         */
        $scope.getPeerId = function() {
            return Broker.getPeerId();
        };

        /**
         * @ngdoc methode
         * @name connect
         * @methodOf unchatbar-connection.controller:dialer
         * @description
         *
         * connect to client
         *
         */
        $scope.connect = function () {
            Broker.connect($scope.connectId);
            $scope.connectId = '';
        };
    }
]);