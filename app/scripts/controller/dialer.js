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
         * @name peerId
         * @methodOf unchatbar-connection.controller:dialer
         * @return {String} peerId from Broker
         * @description
         *
         * client peer id
         *
         */
        $scope.peerId = $scope.peerId || Broker.getPeerIdFromStorage();

        /**
         * @ngdoc methode
         * @name peerId
         * @methodOf unchatbar-connection.controller:dialer
         * @return {String} peerId from Broker
         * @description
         *
         * client peer id
         *
         */
        $scope.peerIdFromStorage = Broker.getPeerIdFromStorage();

        /**
         * @ngdoc methode
         * @name newPeerId
         * @methodOf unchatbar-connection.controller:dialer
         * @return {String} peerId from Broker
         * @description
         *
         * new client peer id
         *
         */
        $scope.newPeerId = '';
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
            $scope.peerId = Broker.getPeerId();
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
            if($scope.connectId) {
                Broker.connect($scope.connectId);
                $scope.connectId = '';
            }
        };

        /**
         * @ngdoc methode
         * @name login
         * @methodOf unchatbar-connection.controller:dialer
         * @description
         *
         * authenticate to broker server
         *
         */
        $scope.login = function () {
            if($scope.newPeerId) {
                Broker.setPeerId($scope.newPeerId);
                Broker.connectServer();
            }
        };
    }
]);