'use strict';
/**
 * @ngdoc overview
 * @name unchatbar-connection
 * @description
 * # unchatbar-connection
 *
 * Main module of the application.
 */
angular.module('unchatbar-connection').run(['$rootScope', 'Broker', 'DataConnection',
    function ($rootScope, Broker,DataConnection) {
        Broker.initStorage();
        if (Broker.getPeerIdFromStorage()) {
            Broker.connectServer();
        }

        $rootScope.$on('BrokerPeerConnection', function (event, data) {
            DataConnection.add(data.connection);
        });

        $rootScope.$on('dataConnectionOpen', function (event, data) {
            DataConnection.sendFromQueue(data.peerId);
        });

        $rootScope.$on('ConnectionGetMessage_readMessage', function (event, data) {
            DataConnection.removeFromQueue(data.peerId, data.message.id);
        });
    }
]);
