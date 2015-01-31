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
         * @ngdoc property
         * @name peerId
         * @propertyOf unchatbar-connection.controller:dialer
         * @returns {String} id from broker
         */
        $scope.peerId = Broker.getPeerId();

        /**
         * @ngdoc property
         * @name connectId
         * @propertyOf unchatbar-connection.controller:dialer
         * @returns {String} client id for connect
         */
        $scope.connectId = '';

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

        $scope.$on('BrokerPeerOpen', function () {
            $scope.peerId = Broker.getPeerId();

        });
    }
]);