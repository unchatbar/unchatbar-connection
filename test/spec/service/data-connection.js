'use strict';

describe('Serivce: dataConnection', function () {
    var BrokerService, rootScope, sessionStorage, DataConnectionService, localStorage;

    beforeEach(module('unchatbar-connection'));

    var mockDb = {
        messages: {
            where: function () {
                return this;
            },
            equals: function () {
                return this;
            },
            add: function () {
                return this;
            },
            each: function () {
            },
            delete: function () {
            },
            count: function () {
            }
        },
        queue: {
            where: function () {
                return this;
            },
            equals: function () {
                return this;
            },
            and: function () {
                return this;
            },
            add: function () {
            },
            each: function () {
            },
            delete: function () {
            },
            count: function () {
            }
        }
    };

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
                expect(DataConnectionService._db).toBeNull();
            });
        });
    });

    describe('check methode', function () {

        describe('initStorage', function () {
            var storageMock;
            beforeEach(function () {
                storageMock = {
                    version: function () {
                        return this;
                    },
                    stores: function () {
                    },
                    open: function () {
                    }
                }
                spyOn(window, 'Dexie').and.returnValue(storageMock);

            });
            it('should create Dexie object with `unTextChat`', function () {
                DataConnectionService.initStorage();

                expect(window.Dexie).toHaveBeenCalledWith('unConnection');
            });
            it('should call Dexie.version width DBVERSION', function () {
                spyOn(storageMock, 'version').and.callThrough();
                DataConnectionService.DBVERSION = 2;
                DataConnectionService.initStorage();

                expect(storageMock.version).toHaveBeenCalledWith(2);
            });

            it('should call Dexie.stores table message', function () {
                spyOn(storageMock, 'stores').and.callThrough();

                DataConnectionService.initStorage();

                expect(storageMock.stores).toHaveBeenCalledWith({
                    queue: "++id,messageId,receiver",
                    messages: "++id,messageId,action,meta"
                });
            });

            it('should call Dexie.open', function () {
                spyOn(storageMock, 'open').and.callThrough();
                DataConnectionService.initStorage();

                expect(storageMock.open).toHaveBeenCalled();
            });
        });

        describe('getOpenConnectionMap', function () {
            it('should return `DataConnection._connectionMap', function () {
                DataConnectionService._connectionMap = {test: 'data'};
                expect(DataConnectionService.getOpenConnectionMap()).toEqual({test: 'data'});
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
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('dataConnectionOpen', {peerId: 'peerId'});
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

                it('should broadcast `dataConnectionClose`', function () {
                    peerCallBack.close();
                    expect(rootScope.$broadcast).toHaveBeenCalledWith('dataConnectionClose', {});
                });
            });

            describe('listener `data`', function () {
                beforeEach(function () {
                    DataConnectionService._connectionMap.peerId = {
                        send: function () {
                        }
                    }
                    spyOn(DataConnectionService._connectionMap.peerId, 'send').and.returnValue(true);
                });
                it('should call DataConnectionService.data ', function () {
                    expect(connection.on).toHaveBeenCalledWith('data', jasmine.any(Function));
                });

                it('should call `Connection.send` with  action `readMessage`and message.id', function () {
                    peerCallBack.data({
                        action: 'myAction',
                        messageId: 'UUID'
                    });
                    expect(DataConnectionService._connectionMap.peerId.send).toHaveBeenCalledWith(
                        {action: 'readMessage', id: 'UUID'}
                    );
                });

                it('should not call `Connection.send`, when action is `readMessage`', function () {
                    peerCallBack.data({
                        action: 'readMessage',
                        id: 'UUID'
                    });
                    expect(DataConnectionService._connectionMap.peerId.send).not.toHaveBeenCalled();
                });

                it('should broadcast message', function () {
                    peerCallBack.data({action: 'myAction', id: 'UUID'});
                    expect(rootScope.$broadcast).toHaveBeenCalledWith(
                        'ConnectionGetMessage_myAction', {
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
                DataConnectionService.send('testPeerId', 'testAction', {meta: 'test'});
                expect(DataConnectionService._addToQueue).not.toHaveBeenCalled();
            });
            it('should call `dataConnection._addToQueue` with peerId and message object', function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');
                DataConnectionService.send('testPeerId', 'testAction', {meta: 'test'});
                expect(DataConnectionService._addToQueue).toHaveBeenCalledWith(
                    'testPeerId', {messageId: 'testUUID', action: 'testAction', meta: {meta: 'test'}}
                );
            });

            it('should call `dataConnection._addToQueue`  width old messageId', function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');
                DataConnectionService.send('testPeerId', 'testAction', {meta: 'test'},'messageId');
                expect(DataConnectionService._addToQueue).toHaveBeenCalledWith(
                    'testPeerId', {messageId: 'messageId', action: 'testAction', meta: {meta: 'test'}}
                );
            });

            it('should return `message.id`', function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');

                expect(DataConnectionService.send('testPeerId', 'testAction', {meta: 'test'})).toBe('testUUID');
            });


            it('should return old messageId`', function () {
                spyOn(BrokerService, 'getPeerId').and.returnValue('ownPeerId');

                expect(DataConnectionService.send('testPeerId', 'testAction', {meta: 'test'},'oldMessageId')).toBe('oldMessageId');
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
                    DataConnectionService.send('peerId', 'testAction', {meta: 'test'});
                    expect(DataConnectionService._connectionMap.peerId.send).toHaveBeenCalledWith(
                        {
                            action: 'testAction',
                            messageId: 'testUUID',
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
                    DataConnectionService.send('peerId', 'testAction', {meta: 'test'});

                    expect(BrokerService.connect).toHaveBeenCalledWith('peerId');
                });
            });
        });

        describe('sendFromQueue', function () {
            describe('peerId has items in queue ', function () {
                beforeEach(function () {
                    DataConnectionService._connectionMap = {
                        clientPeerId: {
                            send: function () {
                            }
                        }
                    }
                    DataConnectionService._db = mockDb;
                    spyOn(DataConnectionService._db.queue, 'where').and.callThrough();
                    spyOn(DataConnectionService._db.queue, 'equals').and.callThrough();
                    spyOn(DataConnectionService._db.queue, 'each').and.callFake(function (callBack) {
                        callBack.call(this, {
                            messageId: 'messageId',
                            id: 'ownQueueId'
                        });
                    });
                });
                it('should call _db.queue.where with `sendID` ', function () {
                    DataConnectionService.sendFromQueue('clientPeerId');

                    expect(DataConnectionService._db.queue.where).toHaveBeenCalledWith('receiver');
                });

                it('should call _db.queue.equals with argument `sendId` ', function () {
                    DataConnectionService.sendFromQueue('clientPeerId');

                    expect(DataConnectionService._db.queue.equals).toHaveBeenCalledWith('clientPeerId');
                });

                describe('after search in queue', function () {
                    var deferCountMessage;
                    beforeEach(inject(function ($q) {
                        spyOn(DataConnectionService._db.messages, 'where').and.callThrough();
                        spyOn(DataConnectionService._db.messages, 'equals').and.callThrough();
                        spyOn(DataConnectionService._db.queue, 'delete').and.callThrough();

                        spyOn(DataConnectionService._connectionMap.clientPeerId, 'send').and.returnValue(true);
                        spyOn(DataConnectionService._db.messages, 'each').and.callFake(function (callBack) {
                            callBack.call(this, {
                                id: 'messageId'
                            });
                        });
                        spyOn(DataConnectionService._db.messages, 'count').and.callFake(function(){
                            deferCountMessage = $q.defer();
                            return deferCountMessage.promise;
                        });
                        DataConnectionService.sendFromQueue('clientPeerId');
                    }));
                    it('should send message to client ', function () {

                        rootScope.$apply();

                        expect(DataConnectionService._connectionMap.clientPeerId.send).toHaveBeenCalledWith({
                            id: 'messageId'
                        });
                    });

                    it('should call _db.messages.where with `sendID` ', function () {
                        rootScope.$apply();

                        expect(DataConnectionService._db.messages.where).toHaveBeenCalledWith('messageId');
                    });

                    it('should call _db.messages.equals with argument `sendId` ', function () {
                        rootScope.$apply();

                        expect(DataConnectionService._db.messages.equals).toHaveBeenCalledWith('messageId');
                    });

                    it('should call _db.messages.equals with argument `sendId` ', function () {
                        rootScope.$apply();

                        expect(DataConnectionService._db.messages.equals).toHaveBeenCalledWith('messageId');
                    });



                });


            });
        });

        describe('removeFromQueue' , function(){
            describe('after search in queue', function () {
                beforeEach(inject(function ($q) {
                    DataConnectionService._db = mockDb;
                    spyOn(DataConnectionService._db.queue, 'where').and.callThrough();
                    spyOn(DataConnectionService._db.queue, 'equals').and.callThrough();

                    spyOn(DataConnectionService._db.queue, 'delete').and.callFake(function(){
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    });

                }));
                it('should `_db.queue.where` width `messageId` ', function () {
                    spyOn(DataConnectionService._db.queue, 'and').and.callFake(function(callback){
                        return this;
                    });
                    DataConnectionService.removeFromQueue('clientPeerId','messageId');

                    expect(DataConnectionService._db.queue.where).toHaveBeenCalledWith('messageId');
                });

                it('should `_db.queue.equals` width argument `messageId` ', function () {
                    spyOn(DataConnectionService._db.queue, 'and').and.callFake(function(callback){
                        return this;
                    });
                    DataConnectionService.removeFromQueue('clientPeerId','messageId');

                    expect(DataConnectionService._db.queue.equals).toHaveBeenCalledWith('messageId');
                });

                it('should return true from `and` when peerId is receiver ', function () {
                    var isPeerReceiver;
                    spyOn(DataConnectionService._db.queue, 'and').and.callFake(function(callback){
                        isPeerReceiver = callback.call(this,{receiver:'clientPeerId'});
                        return this;
                    });
                    DataConnectionService.removeFromQueue('clientPeerId','messageId');

                    expect(isPeerReceiver).toBe(true);
                });

                it('should return false from `and` when peerId is not receiver ', function () {
                    var isPeerReceiver;
                    spyOn(DataConnectionService._db.queue, 'and').and.callFake(function(callback){
                        isPeerReceiver = callback.call(this,{receiver:'clientPeerIdOther'});
                        return this;
                    });
                    DataConnectionService.removeFromQueue('clientPeerId','messageId');

                    expect(isPeerReceiver).toBe(false);
                });

                it('should call `_db.queue.delete` ', function () {
                    spyOn(DataConnectionService._db.queue, 'and').and.callFake(function(callback){
                        return this;
                    });
                    DataConnectionService.removeFromQueue('clientPeerId','messageId');

                    expect(DataConnectionService._db.queue.delete).toHaveBeenCalled();
                });

                describe('after resolve this._db.queue.delete' , function(){
                   var deferQueueCount;
                    beforeEach(inject(function($q){
                       spyOn(DataConnectionService._db.queue, 'and').and.callFake(function(callback){
                           return this;
                       });
                       DataConnectionService.removeFromQueue('clientPeerId','messageId');
                       DataConnectionService._db.queue.where.calls.reset();
                       DataConnectionService._db.queue.equals.calls.reset();
                        spyOn(DataConnectionService._db.messages, 'where').and.callThrough();
                        spyOn(DataConnectionService._db.messages, 'equals').and.callThrough();
                        spyOn(DataConnectionService._db.messages, 'delete').and.callThrough();

                        spyOn(DataConnectionService._db.queue, 'count').and.callFake(function(){
                          deferQueueCount = $q.defer();
                          return deferQueueCount.promise;
                       });
                   }));
                   it('should `_db.queue.where` width `messageId` ', function () {
                        rootScope.$apply();
                        expect(DataConnectionService._db.queue.where).toHaveBeenCalledWith('messageId');
                   });

                   it('should `_db.queue.equals` width argument `messageId` ', function () {
                        rootScope.$apply();

                        expect(DataConnectionService._db.queue.equals).toHaveBeenCalledWith('messageId');
                   });
                   describe('no messageId exists in queue' , function(){
                       beforeEach(function(){
                           rootScope.$apply();
                           deferQueueCount.resolve(0);
                       });
                       it('should call `_db.queue.where` width `messageId` ', function () {
                           rootScope.$apply();
                           expect(DataConnectionService._db.messages.where).toHaveBeenCalledWith('messageId');
                       });

                       it('should call `_db.queue.equals` width argument `messageId` ', function () {
                           rootScope.$apply();

                           expect(DataConnectionService._db.messages.equals).toHaveBeenCalledWith('messageId');
                       });

                       it('should call `_db.queue.where` width `messageId` ', function () {
                           rootScope.$apply();
                           expect(DataConnectionService._db.messages.delete).toHaveBeenCalled();
                       });
                   });
                    describe('no messageId exists in queue' , function() {
                        beforeEach(function () {
                            rootScope.$apply();
                            deferQueueCount.resolve(1);
                        });
                        it('should not call `_db.queue.where` ', function () {
                            rootScope.$apply();
                            expect(DataConnectionService._db.messages.where).not.toHaveBeenCalled();
                        });
                    });

                });

            });

        })

        describe('_addToQueue', function () {
            var deferCountMessage;
            beforeEach(inject(function ($q) {
                DataConnectionService._db = mockDb;
                spyOn(DataConnectionService._db.queue, 'add').and.callThrough();
                spyOn(DataConnectionService._db.messages, 'where').and.callThrough();
                spyOn(DataConnectionService._db.messages, 'equals').and.callThrough();
                spyOn(DataConnectionService._db.messages, 'add').and.callThrough();
                spyOn(DataConnectionService._db.messages, 'count').and.callFake(function(){
                    deferCountMessage = $q.defer();
                    return deferCountMessage.promise;
                });
            }));
            it('should insert peerId and messageId into queue table', function () {
                DataConnectionService._addToQueue('peerId', {messageId: 'messageId', test: 'data'});
                expect(DataConnectionService._db.queue.add).toHaveBeenCalledWith({
                    messageId:'messageId',
                    receiver : 'peerId'
                });
            });

            it('should call _db.messages.where with `messageId` ', function () {
                DataConnectionService._addToQueue('peerId', {messageId: 'messageId', test: 'data'});

                expect(DataConnectionService._db.messages.where).toHaveBeenCalledWith('messageId');
            });

            it('should call _db.messages.equals with argument `messageId` ', function () {
                DataConnectionService._addToQueue('peerId', {messageId: 'messageId', test: 'data'});

                expect(DataConnectionService._db.messages.equals).toHaveBeenCalledWith('messageId');
            });
            describe('after count ' , function(){

                it('should call add when messageId is not in messageTable' , function(){
                    DataConnectionService._addToQueue('peerId', {messageId: 'messageId', test: 'data'});
                    deferCountMessage.resolve(0);

                    rootScope.$apply();

                    expect(DataConnectionService._db.messages.add).toHaveBeenCalledWith({messageId: 'messageId', test: 'data'});
                });
                it('should not call add when messageId is in messageTable' , function(){
                    DataConnectionService._addToQueue('peerId', {messageId: 'messageId', test: 'data'});
                    deferCountMessage.resolve(1);
                    rootScope.$apply();

                    expect(DataConnectionService._db.messages.add).not.toHaveBeenCalled();
                });
            })
        });
    });
});