'use strict';

describe('Controller: dialer', function () {

    beforeEach(module('unchatbar-connection'));

    var modalPasswordCTRL, scope, brokerService, modalInstance;

    beforeEach(inject(function ($controller, $rootScope, Broker) {
        scope = $rootScope.$new();
        brokerService = Broker;
        modalInstance = {
            close: function () {
            },
            dismiss: function () {
            }
        }
        modalPasswordCTRL = function () {
            $controller('modelPassword', {
                $scope: scope,
                Broker: brokerService,
                $modalInstance: modalInstance

            });
        };
    }));

    describe('check methode', function () {
        beforeEach(function () {
            modalPasswordCTRL();
        });
        describe('init', function () {
            it('should return value from `Broker.getPeerId``', function () {
                spyOn(brokerService, 'getPass').and.returnValue('clientPass');
                scope.init()
                expect(scope.pass).toBe('clientPass');
            });
        });
        describe('update', function () {
            beforeEach(function () {
                spyOn(brokerService, 'setPass').and.returnValue(true);
                spyOn(brokerService, 'connectServer').and.returnValue(true);
                spyOn(modalInstance, 'close').and.returnValue(true);
            });
            it('should call `Broker.setPass` with `$scope.pass`', function () {
                scope.pass = 'newPass';

                scope.update();

                expect(brokerService.setPass).toHaveBeenCalledWith('newPass');
            });

            it('should call `Broker.connectServer`', function () {
                scope.update();

                expect(brokerService.connectServer).toHaveBeenCalled();
            });

            it('should call `Broker.connectServer`', function () {
                scope.update();

                expect(modalInstance.close).toHaveBeenCalled();
            });
        });

        describe('cancel', function () {
            beforeEach(function () {
                spyOn(brokerService, 'setPeerId').and.returnValue(true);
                spyOn(modalInstance, 'dismiss').and.returnValue(true);
            });

            it('should call `Broker.connectServer`', function () {
                scope.cancel();

                expect(brokerService.setPeerId).toHaveBeenCalledWith('');
            });

            it('should call `Broker.connectServer`', function () {
                scope.cancel();

                expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
            });

        });
    });


});
