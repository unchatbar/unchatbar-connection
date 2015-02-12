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


    describe('check html', function () {
        var element;
        beforeEach(function () {
            element = build();
        });
        it('should contain `peerId`', inject(function ($rootScope) {
            element.scope().peerId = 'testPeerId';

            $rootScope.$digest();

            expect(element.html()).toContain("testPeerId");
        }));
    });

});