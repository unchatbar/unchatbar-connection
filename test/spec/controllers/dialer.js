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

                expect(scope.getPeerId()).toBe('peerId');
            });
        });
        describe('connect', function () {
            it('should call `broker.connect` width `$scope.connectId `', function () {
                spyOn(brokerService, 'connect').and.returnValue('');
                scope.connectId = 'test';

                scope.connect();

                expect(brokerService.connect).toHaveBeenCalledWith('test');
            });
            it('should set `scope.connectId` to empty string ', function () {
                spyOn(brokerService, 'connect').and.returnValue('');
                scope.connectId = 'test';

                scope.connect();

                expect(scope.connectId).toBe('');
            });
        });
    });


});
