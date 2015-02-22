'use strict';

angular.module('unchatbar-connection')
    .config(['BrokerProvider',  'LOCALSTORAGE',
        function (BrokerProvider, LOCALSTORAGE) {
            BrokerProvider.setHost('unchatbar-server.herokuapp.com');
        }]);