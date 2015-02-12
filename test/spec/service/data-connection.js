'use strict';

describe('Serivce: dataConnection', function () {
    var BrokerService, rootScope, sessionStorage, DataConnectionService, localStorage;

    beforeEach(module('unchatbar-connection'));


    beforeEach(inject(function ($rootScope, DataConnection, Broker, $sessionStorage) {
        rootScope = $rootScope;
        BrokerService = Broker;
        DataConnectionService = DataConnection;
        sessionStorage = $sessionStorage;

    }));
    describe('check init', function () {
        describe('_connectionMap', function () {
            it('should be an empty string', function () {
                expect(DataConnectionService._connectionMap).toEqual({});
            });
        });
        describe('_storage', function () {
            it('should be an empty string', function () {
                expect(DataConnectionService._storage).toEqual({queue: {}});
            });
        });
    });
    describe('check methode', function () {

        describe('initStorage', function () {
            var sessionStorage = {};
            beforeEach(inject(function ($sessionStorage) {
                sessionStorage = $sessionStorage;
                spyOn(sessionStorage, '$default').and.returnValue({dataConnection: {test: 'data'}});
                DataConnectionService.initStorage();
            }));
            it('should call `$sessionStorage.$default` with object', function () {
                expect(sessionStorage.$default).toHaveBeenCalledWith({
                    dataConnection: {
                        queue: {}
                    }
                });
            });
            it('should set  `DataConnectionService._storage` return value from `$sessionStorage.$default`', function () {
                expect(DataConnectionService._storage).toEqual({test: 'data'});
            });
        });

        describe('add', function () {
            var connection = {}, peerCallBack = {};
            beforeEach(function () {
                connection.peer = 'peerId';
                peerCallBack.peer = 'peerId';
                connection.on = function () {
                };
                spyOn(connection, 'on').and.callFake(function (eventName, callBack) {
                    peerCallBack[eventName] = callBack;
                });
                spyOn(rootScope, '$broadcast').and.returnValue(true);
                DataConnectionService.add(connection);
            });


            describe('listener `open`', function () {

                it('should call DataConnectionService.on with param `open`', function () {
                    expect(connection.on).toHaveBeenCalledWith('open', jasmine.any(Function));
                });

                it('should store connection in _connectionMap', function () {
                    peerCallBack.open('newPeerId');
                    expect(DataConnectionService._connectionMap).toEqual(
                        {peerId: peerCallBack}
                    );
                });

                it('should broadcast connection open', function () {
                    peerCallBack.open('newPeerId');
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('ConnectionOpen', {peerId: 'peerId'});
                });
            });

            describe('listener `close`', function () {
                it('should call DataConnectionService.close with param `open`', function () {
                    expect(connection.on).toHaveBeenCalledWith('close', jasmine.any(Function));
                });
                it('should remove connection from storage', function () {
                    peerCallBack.close();
                    expect(DataConnectionService._connectionMap).toEqual({});
                });
            });

            describe('listener `data`', function () {
                beforeEach(function () {
                    spyOn(DataConnectionService, 'send').and.returnValue(true);
                });
                it('should call DataConnectionService.data ', function () {
                    expect(connection.on).toHaveBeenCalledWith('data', jasmine.any(Function));
                });

                it('should call `Connection.send` with clientPeerId and action `readMessage`and message.id', function () {
                    peerCallBack.data({
                        action: 'myAction',
                        id: 'UUID'
                    });
                    expect(DataConnectionService.send).toHaveBeenCalledWith('peerId',
                        {action: 'readMessage', id: 'UUID'}
                    );
                });

                it('should not call `Connection.send`, when action is `readMessage`', function () {
                    peerCallBack.data({
                        action: 'readMessage',
                        id: 'UUID'
                    });
                    expect(DataConnectionService.send).not.toHaveBeenCalled();
                });

                it('should broadcast message', function () {
                    peerCallBack.data({action: 'myAction', id: 'UUID'});
                    expect(rootScope.$broadcast).toHaveBeenCalledWith(
                        'ConnectionGetMessagemyAction_', {
                            peerId: 'peerId',
                            message: {action: 'myAction', id: 'UUID'}
                        });
                });
            });
        });

        describe('send', function () {
            beforeEach(function () {
                spyOn(DataConnectionService, '_addToQueue').and.returnValue(true);
                spyOn(DataConnectionService, '_createUUID').and.returnValue('testUUID');
                spyOn(BrokerService, 'connect').and.returnValue(true);

            });
            it('should not call `dataConnection._addToQueue` when peerId is equal own peer id', function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('testPeerId');
                DataConnectionService.send('testPeerId', 'myMessage', 'testAction', {meta: 'test'});
                expect(DataConnectionService._addToQueue).not.toHaveBeenCalled();
            });
            it('should call `dataConnection._addToQueue` with peerId and message object', function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');
                DataConnectionService.send('testPeerId', 'myMessage', 'testAction', {meta: 'test'});
                expect(DataConnectionService._addToQueue).toHaveBeenCalledWith(
                    'testPeerId', {text: 'myMessage', id: 'testUUID', action: 'testAction', meta: {meta: 'test'}}
                );
            });
            describe('connection-id exists', function () {
                beforeEach(function () {
                    spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');
                    DataConnectionService._connectionMap = {
                        'peerId': {
                            open: true,
                            send: function (message) {
                                return message;
                            }
                        }
                    };
                    spyOn(DataConnectionService._connectionMap.peerId, 'send').and.returnValue(true);

                });
                it('should call send with message', function () {
                    DataConnectionService.send('peerId', 'myMessage', 'testAction', {meta: 'test'});
                    expect(DataConnectionService._connectionMap.peerId.send).toHaveBeenCalledWith(
                        {
                            text: 'myMessage',
                            action: 'testAction',
                            id: 'testUUID',
                            meta: {meta: 'test'}
                        }
                    );
                });

            });

            describe('connection id not exists', function () {

                beforeEach(function () {
                    spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');
                    DataConnectionService._connectionMap = {};
                });

                it('should call `Broker.connect` with peer ID', function () {
                    DataConnectionService.send('peerId', 'myMessage', 'testAction', {meta: 'test'});

                    expect(BrokerService.connect).toHaveBeenCalledWith('peerId');
                });
            });
        });

        describe('sendFromQueue', function () {
            describe('peerId has no items in queue ', function () {
                beforeEach(function () {
                    DataConnectionService._storage.queue = {};
                    spyOn(DataConnectionService, 'send').and.returnValue(true);

                });
                it('should not call `Connection.send` for message in storage queue', function () {

                    DataConnectionService.sendFromQueue('peerId');

                    expect(DataConnectionService.send).not.toHaveBeenCalled();
                });
            });
            describe('peerId has items in queue ', function () {
                beforeEach(function () {
                    DataConnectionService._storage.queue = {'peerId': ['message']};

                    DataConnectionService._connectionMap = {
                        'peerId': {
                            open: true,
                            send: function (message) {
                                return message;
                            }
                        }
                    };
                    spyOn(DataConnectionService._connectionMap.peerId,'send').and.returnValue(true);
                });
                it('should not call `Connection.send` for message in storage queue', function () {
                    DataConnectionService.sendFromQueue('peerId');
                    expect(DataConnectionService._connectionMap.peerId.send).toHaveBeenCalledWith('message');
                });
            });
        });

        describe('removeFromQueue', function () {
            it('should remove mesage from client', function () {
                DataConnectionService._storage.queue = {
                    peerId: {
                        messageIdA: 'data',
                        messageIdB: 'data'
                    }
                };
                DataConnectionService.removeFromQueue('peerId', 'messageIdA');

                expect(DataConnectionService._storage.queue).toEqual({
                    peerId: {
                        messageIdB: 'data'
                    }
                });
            });

            it('should remove client from queue', function () {
                DataConnectionService._storage.queue = {
                    peerId: {
                        messageIdA: 'data'
                    }
                };
                DataConnectionService.removeFromQueue('peerId', 'messageIdA');

                expect(DataConnectionService._storage.queue).toEqual({});
            });
        });

        describe('_addToQueue', function () {
            it('should push `_storageMessages.queue` to peerId key', function () {
                DataConnectionService._storage.queue = {};
                DataConnectionService._addToQueue('peerId', {id: 'UUId', test: 'data'});
                expect(DataConnectionService._storage.queue).toEqual({
                    'peerId': {
                        UUId: {id: 'UUId', test: 'data'}
                    }
                });
            });
        });

    });
})
;