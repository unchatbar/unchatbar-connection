describe('Directive: unConnectionDialer', function () {
    var build = function () {
    };

    beforeEach(module('test/mock/views/unchatbar-connection/dialer.html'));
    beforeEach(module('unchatbar-connection'));

    beforeEach(inject(function ($compile, $rootScope, $templateCache) {
        var template = $templateCache.get('test/mock/views/unchatbar-connection/dialer.html');
        $templateCache.put("views/unchatbar-connection/dialer.html",
            template
        );
        build = function () {
            var element = $compile("<un-connection-dialer></un-connection-dialer>")($rootScope);
            $rootScope.$digest();
            return element;
        };
    }));


    describe('check html', function () {
        var element;
        beforeEach(function () {
            element = build();
        });
        it('should contain text `connect to client`', inject(function ($rootScope) {
            expect(element.html()).toContain("connect to client");
        }));
    });


});