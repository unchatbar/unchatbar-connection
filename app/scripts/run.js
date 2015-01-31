'use strict';
/**
 * @ngdoc overview
 * @name unchatbar-connection
 * @description
 * # unchatbar-connection
 *
 * Main module of the application.
 */
angular.module('unchatbar-connection').run(['$rootScope', '$state', 'Broker', 'MessageText', 'PhoneBook', 'Profile', 'Connection', 'Stream', 'Notify',
    function ($rootScope, $state, Broker, MessageText, PhoneBook, Profile, Connection, Stream, Notify) {
        Broker.initStorage();
        $rootScope.$on('ConnectionOpen', function (event, data) {
            Connection.send(data.peerId, {action: 'profile', profile: Profile.get()});
        });

        $rootScope.$on('BrokerPeerConnection', function (event, data) {
            //direct call
            Connection.add(data.connection);
        });

    }
]);
