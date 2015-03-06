'use strict';

/**
 * @ngdoc controller
 * @name  unchatbar-connection.controller:modelPassword
 * @require $scope
 * @require Broker
 * @require $modalInstance
 * @description
 *
 * modal for new password
 *
 */
angular.module('unchatbar-connection').controller('modelPassword', ['$scope', 'Broker','$modalInstance',
    function ($scope, Broker,$modalInstance) {
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
        $scope.pass = '';

        /**
         * @ngdoc methode
         * @name init
         * @methodOf unchatbar-connection.controller:dialer
         * @description
         *
         * init modal
         *
         */
        $scope.init = function(){
            $scope.pass = Broker.getPass();
        };

        /**
         * @ngdoc methode
         * @name update
         * @methodOf unchatbar-connection.controller:dialer
         * @description
         *
         * update password and start connection
         *
         */
        $scope.update = function () {
            Broker.setPass($scope.pass);
            $modalInstance.close();
            Broker.connectServer();

        };

        /**
         * @ngdoc methode
         * @name update
         * @methodOf unchatbar-connection.controller:dialer
         * @description
         *
         * reset peerId and close modal
         *
         */
        $scope.cancel = function () {
            Broker.setPeerId('');
            $modalInstance.dismiss('cancel');
        };
    }
]);