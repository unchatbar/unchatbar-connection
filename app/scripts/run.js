'use strict';
/**
 * @ngdoc overview
 * @name unchatbar-connection
 * @description
 * # unchatbar-connection
 *
 * Main module of the application.
 */
angular.module('unchatbar-connection').run(['$rootScope', 'Broker', 'MessageText',  'Connection', 'Stream',
    function ($rootScope, Broker, MessageText, Connection, Stream) {
        Broker.initStorage();

        $rootScope.$on('BrokerPeerConnection', function (event, data) {
            //direct call
            Connection.add(data.connection);
        });

        $rootScope.$on('ConnectionOpen', function (event, data) {
            Connection.send(data.peerId, {action: 'profile', profile: Profile.get()});
            MessageText.sendFromQueue(data.peerId);
        });

        $rootScope.$on('ConnectionGetMessagetextMessage', function (event, data) {
            MessageText.addToInbox(data.message.groupId || data.peerId, data.peerId, data.message);
        });

        $rootScope.$on('ConnectionGetMessagereadMessage', function (event, data) {
            MessageText.removeFromQueue(data.peerId, data.message.id);
        });

        $rootScope.$on('ConnectionGetMessageupdateStreamGroup', function (event, data) {
            Stream.callToGroupUsersFromClient(data.peerId, data.message.users);
        });

        $rootScope.$on('profileUpdate', function (event, data) {
            _.forEach(Connection.getMap(), function (connection, peerId) {
                Connection.send(peerId, {action: 'profile', profile: this.get()});
            }.bind(this));
        });

        $rootScope.$on('BrokerPeerConnection', function (event, data) {
            Connection.add(data.connection);
        });

        $rootScope.$on('BrokerPeerCall', function (event, data) {
            Stream.addCallToAnswer(data.client);
        });

    }
]);
