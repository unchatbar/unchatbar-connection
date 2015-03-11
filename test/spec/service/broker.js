'use strict';

describe('Serivce: Broker', function () {
    var brokerService, brokerProvider, peerService, rootScope, modal;
    beforeEach(module('unchatbar-connection', ['BrokerProvider', function (_brokerProvider) {
        brokerProvider = _brokerProvider;
        brokerProvider.setHost('host.de');
        brokerProvider.setPort(12345);
        brokerProvider.setPath('test/');

    }]));


    beforeEach(inject(function ($rootScope, $modal, Broker, Peer) {
        rootScope = $rootScope;
        modal = $modal;
        brokerService = Broker;
        peerService = Peer;

    }));

    describe('check methode', function () {

        describe('setPeerId', function () {
            it('should set `Broker._storage.peerId` with peerId', function () {
                brokerService.setPeerId('testPeerId');
                expect(brokerService._storage.peerId).toBe('testPeerId');
            });
        });

        describe('getPeerIdFromStorage', function () {
            it('should return peerId from `Broker._storage.peerId`', function () {
                brokerService._storage.peerId = 'testPeerId';
                expect(brokerService.getPeerIdFromStorage()).toBe('testPeerId');
            });
        });

        describe('initStorage', function () {
            var sessionStorage = {};
            beforeEach(inject(function ($sessionStorage) {
                sessionStorage = $sessionStorage;
                spyOn(sessionStorage, '$default').and.returnValue({broker: {test: 'data'}});
                brokerService.initStorage();
            }));
            it('should call `$sessionStorage.$default` with object', function () {
                expect(sessionStorage.$default).toHaveBeenCalledWith({
                    broker: {
                        peerId: '',
                        pass: ''
                    }
                });
            });
            it('should set  `brokerService._storage` return value from `$sessionStorage.$default`', function () {
                expect(brokerService._storage).toEqual({test: 'data'});
            });
        });


        describe('destroyServerConnection', function () {
            var peer = {
                destroy: function () {
                }
            };
            describe('connection-id exists', function () {

                beforeEach(inject(function ($sessionStorage) {
                    spyOn(peerService, 'get').and.returnValue(peer);
                    spyOn(brokerService, 'getPeerId').and.returnValue(true);
                    spyOn(peer, 'destroy').and.returnValue(true);
                }));
                it('should call `$sessionStorage.$default` with object', function () {
                    brokerService.destroyServerConnection();
                    expect(peer.destroy).toHaveBeenCalled();
                });
            });

            describe('connection-id not exists', function () {
                beforeEach(inject(function ($sessionStorage) {
                    spyOn(peerService, 'get').and.returnValue(peer);
                    spyOn(brokerService, 'getPeerId').and.returnValue(false);
                    spyOn(peer, 'destroy').and.returnValue(true);
                }));
                it('should call `$sessionStorage.$default` with object', function () {
                    brokerService.destroyServerConnection();
                    expect(peer.destroy).not.toHaveBeenCalled();
                });
            });
        });

        describe('connectServer', function () {
            beforeEach(function () {

                spyOn(peerService, 'init').and.returnValue('peer');
                spyOn(brokerService, '_peerListener').and.returnValue(true);
                spyOn(brokerService, '_generateNewPass').and.returnValue('newPass');
            });
            it('should not call `Broker._generateNewPass`, when password is defined in stroage', function () {
                brokerService._storage.peerId = 'peerTest';
                brokerService.connectServer();
                expect(brokerService._storage.pass).toBe('newPass');

            });
            it('should call Peer.init with peerId and provider options', function () {
                brokerService._storage.peerId = 'peerTest';
                brokerService._storage.pass = 'oldPass';
                brokerService.connectServer();

                expect(peerService.init).toHaveBeenCalledWith('peerTest', {
                    host: 'host.de',
                    port: 12345,
                    path: 'test/',
                    meta: {
                        pass: 'oldPass'
                    },
                    config: {iceServers: []},
                    secure: false,
                    debug: 0
                });
            });
            it('should call _peerListener', function () {
                brokerService.connectServer();

                expect(brokerService._peerListener).toHaveBeenCalled();
            });


        });

        describe('_peerListener', function () {
            var peer = {}, peerCallBack = {}, rootScope;
            beforeEach(inject(function ($rootScope) {
                rootScope = $rootScope;
                peer.on = function () {
                };
                spyOn(peerService, 'get').and.returnValue(peer);
                spyOn(peer, 'on').and.callFake(function (eventName, callBack) {
                    peerCallBack[eventName] = callBack;
                });
                brokerService._peerListener();
            }));
            describe('peer.open', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onOpen').and.returnValue(true);
                });

                it('should call peer.on with param `open`', function () {
                    expect(peer.on).toHaveBeenCalledWith('open', jasmine.any(Function));
                });
                it('should call `brokerService._onOpen` with `peer`and peerId', function () {
                    peerCallBack.open('peerId');
                    expect(brokerService._onOpen).toHaveBeenCalledWith('peerId');
                });

            });
            describe('peer.call', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onCall').and.returnValue(true);
                });

                it('should call peer.call with param `call`', function () {
                    expect(peer.on).toHaveBeenCalledWith('call', jasmine.any(Function));
                });
                it('should call `brokerService._onCall` with `peer`and peerId', function () {
                    peerCallBack.call('call');
                    expect(brokerService._onCall).toHaveBeenCalledWith('call');
                });
            });

            describe('peer.connection', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onConnection').and.returnValue(true);
                });

                it('should call peer.on with param `connection`', function () {
                    expect(peer.on).toHaveBeenCalledWith('connection', jasmine.any(Function));
                });
                it('should call `brokerService._onConnection` with `peer`and peerId', function () {
                    peerCallBack.connection('connection');
                    expect(brokerService._onConnection).toHaveBeenCalledWith('connection');
                });
            });

            describe('peer.close', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onClose').and.returnValue(true);
                    spyOn(brokerService, '_handleFailedLogin').and.returnValue(true);
                });

                it('should call peer.on with param `Close`', function () {
                    expect(peer.on).toHaveBeenCalledWith('close', jasmine.any(Function));
                });
                it('should call `brokerService._onClose`', function () {
                    peerCallBack.close();
                    expect(brokerService._onClose).toHaveBeenCalled();
                });
            });

            describe('peer.disconnected', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onDisconnect').and.returnValue(true);
                    spyOn(brokerService, '_handleFailedLogin').and.returnValue(true);
                });

                it('should call peer.on with param `disconnected`', function () {
                    expect(peer.on).toHaveBeenCalledWith('disconnected', jasmine.any(Function));
                });
                it('should call `brokerService._onDisconnect`', function () {
                    peerCallBack.disconnected();
                    expect(brokerService._onDisconnect).toHaveBeenCalled();
                });
            });

            describe('peer.error', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_onError').and.returnValue(true);
                    spyOn(brokerService, '_handleFailedLogin').and.returnValue(true);
                });

                it('should call peer.on with param `error`', function () {
                    expect(peer.on).toHaveBeenCalledWith('error', jasmine.any(Function));
                });
                it('should call `brokerService._onError` with `peer`and peerId', function () {
                    peerCallBack.error('error');
                    expect(brokerService._onError).toHaveBeenCalledWith('error');
                });
                it('should call `Broker._handleFailedLogin` when error.message is `Unauthorized`', function () {
                    peerCallBack.error({message: 'Unauthorized'});
                    expect(brokerService._handleFailedLogin).toHaveBeenCalledWith();
                });
            });
        });

        describe('_onOpen', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                spyOn(brokerService, 'setPeerId').and.returnValue(true);
                brokerService._onOpen('newPeerId');
            });

            it('should broadcast on $rootscope new peerid', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerOpen', {id: 'newPeerId'});
            });
        });

        describe('_onCall', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                brokerService._onCall('call');
            });
            it('should broadcast call on $rootscope', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerCall', {client: 'call'});
            });
        });

        describe('_onConnection', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                brokerService._onConnection('connection');
            });
            it('should broadcast call on $rootscope', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerConnection', {connection: 'connection'});
            });
        });

        describe('_onError', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                brokerService._onError('error');
            });
            it('should broadcast call on $rootscope', function () {
                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerError', {error: 'error'});
            });
        });

        describe('_onClose', function () {
            beforeEach(function () {
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                spyOn(brokerService, 'connectServer').and.returnValue(true);
            });
            it('should broadcast call on $rootscope', function () {
                brokerService._onClose();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerClose', {});
            });

            it('should call on brokerService.connectServer', function () {
                brokerService._onClose();

                expect(brokerService.connectServer).toHaveBeenCalled();
            });
        });

        describe('_onDisconnect', function () {
            var peer = {
                reconnect: function () {
                }
            };

            beforeEach(function () {
                spyOn(peerService, 'get').and.returnValue(peer);
                spyOn(peer, 'reconnect').and.returnValue(true);
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                spyOn(brokerService, 'connectServer').and.returnValue(true);
            });
            it('should broadcast call on $rootscope', function () {
                brokerService._onDisconnect();

                expect(rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerDisconnect', {});
            });
            describe('browser is online', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_isBrowserOnline').and.returnValue(true);
                });
                it('should broadcast call on $rootscope', function () {
                    brokerService._onDisconnect();

                    expect(peer.reconnect).toHaveBeenCalled();
                });
            });

            describe('browser is offline', function () {
                beforeEach(function () {
                    spyOn(brokerService, '_isBrowserOnline').and.returnValue(false);
                });
                it('should broadcast call on $rootscope', function () {
                    brokerService._onDisconnect();

                    expect(peer.reconnect).not.toHaveBeenCalled();
                });
            });

        });


        describe('_handleFailedLogin', function () {
            it('should call $modal.open with controller and template', function () {
                spyOn(modal, 'open');
                brokerService._handleFailedLogin();
                expect(modal.open).toHaveBeenCalledWith({
                    templateUrl: 'views/unchatbar-connection/failed-login.html',
                    controller: 'modelPassword'
                });
            });
        });

        describe('connect', function () {
            var peer = {};
            beforeEach(function () {
                peer.connect = function () {
                };
                spyOn(peer, 'connect').and.returnValue('clientConnection');
                spyOn(peerService, 'get').and.returnValue(peer);
            });
            it('should call `peer.connect` with connect id', function () {
                brokerService.connect('clientId');

                expect(peer.connect).toHaveBeenCalledWith('clientId', {reliable: true});
            });


            it('should broadcast `BrokerPeerConnection` with return from peer.connect', inject(function ($rootScope) {
                spyOn($rootScope, '$broadcast').and.returnValue(true);

                brokerService.connect('clientId');

                expect($rootScope.$broadcast).toHaveBeenCalledWith('BrokerPeerConnection', {
                    connection: 'clientConnection'
                });
            }));
        });

        describe('connectStream', function () {
            var peer = {};
            beforeEach(function () {
                peer.call = function () {
                };
                spyOn(peerService, 'get').and.returnValue(peer);

            });
            it('should call `peer.connect` with connect id', function () {
                spyOn(peer, 'call').and.returnValue('clientConnection');

                brokerService.connectStream('clientId', 'stream', 'metadata');

                expect(peer.call).toHaveBeenCalledWith('clientId', 'stream', {metadata: 'metadata'});
            });
        });

        describe('getPeerId', function () {
            it('should return server id from peer ', function () {
                spyOn(peerService, 'get').and.returnValue({id: 'OurId'});

                expect(brokerService.getPeerId()).toBe('OurId');
            });


        });

    });
})
;