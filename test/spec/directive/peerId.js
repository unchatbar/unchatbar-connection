describe('Directive: unConnectionPeerId', function () {
    var build = function () {
    };

    beforeEach(module('test/mock/views/unchatbar-connection/peerId.html'));
    beforeEach(module('unchatbar-connection'));

    beforeEach(inject(function ($compile, $rootScope, $templateCache) {
        var template = $templateCache.get('test/mock/views/unchatbar-connection/peerId.html');
        $templateCache.put("views/unchatbar-connection/peerId.html",
            template
        );
        build = function () {
            var element = $compile("<un-connection-peer-id></un-connection-peer-id>")($rootScope);
            $rootScope.$digest();
            return element;
        };
    }));
    describe('check init', function () {
        describe('peerId', function () {
            it('should be an empty string', function () {
                var element = build();

                expect(element.scope().peerId).toBe('');
            });
        });
    });

    describe('check html', function () {
        var element;
        beforeEach(function () {
            element = build();
        });
        it('should contain `peerId`', inject(function ($rootScope) {
            spyOn(element.scope(), 'getPeerId').and.returnValue('testPeerId');
            element.scope().init();
            $rootScope.$digest();
            expect(element.html()).toContain("testPeerId");
        }));
    });

    describe('check methode', function () {
        var element;
        beforeEach(function () {
            element = build();
        });
        describe('init', function () {
            it('should set set value from `scope.getClientMap` to `scope.clientMap`', function () {
                spyOn(element.scope(), 'getPeerId').and.returnValue('peerId');

                element.scope().init();

                expect(element.scope().peerId).toEqual('peerId');
            });
        });
    });

    describe('check events', function () {
        var element;
        beforeEach(function () {
            element = build();
        });
        describe('BrokerPeerOpen', function () {
            it('should call `scope.init()` ', function () {
                spyOn(element.scope(), 'init').and.returnValue(true);

                element.scope().$broadcast('BrokerPeerOpen', {});

                expect(element.scope().init).toHaveBeenCalled();
            });
        });
    });
});