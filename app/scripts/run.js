'use strict';
/**
 * @ngdoc overview
 * @name unchatbar-connection
 * @description
 * # unchatbar-connection
 *
 * Main module of the application.
 */
angular.module('unchatbar-connection').run(['$rootScope', 'Broker', 'dataConnection',
    function ($rootScope, Broker,dataConnection) {
        Broker.initStorage();

        $rootScope.$on('BrokerPeerConnection', function (event, data) {
            dataConnection.add(data.connection);
        });

        $rootScope.$on('ConnectionOpen', function (event, data) {
            dataConnection.sendFromQueue(data.peerId);
        });

        $rootScope.$on('ConnectionGetMessagereadMessage', function (event, data) {
            dataConnection.removeFromQueue(data.peerId, data.message.id);
        });
    }
]);
