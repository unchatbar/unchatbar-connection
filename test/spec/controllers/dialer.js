'use strict';

describe('Controller: dialer', function () {

    beforeEach(module('unchatbar-connection'));

    var dialerCTRL, scope, brokerService;

    beforeEach(inject(function ($controller, $rootScope, Broker) {
        scope = $rootScope.$new();
        brokerService = Broker;

        dialerCTRL = function () {
            $controller('dialer', {
                $scope: scope,
                Broker: brokerService

            });
        };
    }));

    describe('check methode', function () {
        beforeEach(function () {
            dialerCTRL();
        });
        describe('getPeerId', function () {
            it('should return value from `Broker.getPeerId``', function () {
                spyOn(brokerService, 'getPeerId').and.returnValue('peerId');
                scope.getPeerId()
                expect(scope.peerId).toBe('peerId');
            });
        });
        describe('connect', function () {
            it('should call `broker.connect` width `$scope.connectId `', function () {
                spyOn(brokerService, 'connect').and.returnValue('');
                scope.connectId = 'test';

                scope.connect();

                expect(brokerService.connect).toHaveBeenCalledWith('test');
            });

            it('should not call `broker.connect`, when `$scope.connectId` is empty', function () {
                spyOn(brokerService, 'connect').and.returnValue('');
                scope.connectId = '';

                scope.connect();

                expect(brokerService.connect).not.toHaveBeenCalled();
            });

            it('should set `scope.connectId` to empty string ', function () {
                spyOn(brokerService, 'connect').and.returnValue('');
                scope.connectId = 'test';

                scope.connect();

                expect(scope.connectId).toBe('');
            });


        });

        describe('login', function () {
            it('should call `broker.setPeerId` width `$scope.newPeerId `', function () {
                spyOn(brokerService, 'setPeerId').and.returnValue('');
                scope.newPeerId = 'test';

                scope.login();

                expect(brokerService.setPeerId).toHaveBeenCalledWith('test');
            });

            it('should call not `broker.setPeerId`, when `$scope.newPeerId` is empty', function () {
                spyOn(brokerService, 'setPeerId').and.returnValue('');
                scope.newPeerId = '';

                scope.login();

                expect(brokerService.setPeerId).not.toHaveBeenCalled();
            });

            it('should call `broker.connectServer`', function () {
                spyOn(brokerService, 'connectServer').and.returnValue('');
                scope.newPeerId = 'test';

                scope.login();

                expect(brokerService.connectServer).toHaveBeenCalled();
            });
        });
    });


});
