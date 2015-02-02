'use strict';

angular.module('unchatbar-connection')
    .config(['BrokerProvider', 'PhoneBookProvider', 'ProfileProvider', 'MessageTextProvider', 'LOCALSTORAGE',
        function (BrokerProvider,  MessageTextProvider, LOCALSTORAGE) {
            BrokerProvider.setHost('unchatbar-connection-server.herokuapp.com');
        }]);