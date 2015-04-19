'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar-connection.DataConnection
 * @description
 *
 * data connection
 *
 */
angular.module('unchatbar-connection')
    .service('DataConnection', ['$rootScope', 'Broker',
        function ($rootScope, Broker) {
            var api = {

                /**
                 * @ngdoc methode
                 * @name _connectionMap
                 * @propertyOf unchatbar-connection.DataConnection
                 * @private
                 * @returns {Object} connection storage
                 *
                 */
                _connectionMap: {},

                /**
                 * @ngdoc methode
                 * @name _db
                 * @propertyOf unchatbar-connection.DataConnection
                 * @private
                 * @returns {Object} database connector
                 *
                 */
                _db: null,

                /**
                 * @ngdoc methode
                 * @name DBVERSION
                 * @propertyOf unchatbar-connection.DataConnection
                 * @private
                 * @returns {Number} database version
                 *
                 */
                DBVERSION: 1,


                /**
                 * @ngdoc methode
                 * @name initStorage
                 * @methodOf unchatbar-connection.DataConnection
                 * @description
                 *
                 * init storage
                 */
                initStorage: function () {
                    this._db = new window.Dexie('unConnection');
                    this._db.version(this.DBVERSION).stores(
                        {
                            queue: "++id,messageId,receiver",
                            messages: "++id,messageId,action,meta"
                        }
                    );
                    this._db.open();
                },

                /**
                 * @ngdoc methode
                 * @name getOpenConnectionMap
                 * @methodOf unchatbar-connection.DataConnection
                 * @description
                 *
                 * get map of open connection
                 *
                 */
                getOpenConnectionMap: function () {
                    return this._connectionMap;
                },
                /**
                 * @ngdoc methode
                 * @name add
                 * @methodOf unchatbar-connection.DataConnection
                 * @param {Object} connection client connection
                 * @private
                 * @description
                 *
                 * add a new client connection
                 *
                 */
                add: function (connection) {
                    connection.on('open', function () {
                        api._connectionMap[this.peer] = this;
                        /**
                         * @ngdoc event
                         * @name ConnectionOpen
                         * @eventOf unchatbar-connection.DataConnection
                         * @eventType broadcast on root scope
                         * @param {String} peerId id of client
                         * @description
                         *
                         * new connection to client is open
                         *
                         */
                        $rootScope.$broadcast('dataConnectionOpen', {peerId: this.peer});
                    });
                    connection.on('close', function () {
                        delete api._connectionMap[this.peer];
                        /**
                         * @ngdoc event
                         * @name ConnectionOpen
                         * @eventOf unchatbar-connection.DataConnection
                         * @eventType broadcast on root scope
                         * @param {String} peerId id of client
                         * @description
                         *
                         * new connection to client is open
                         *
                         */
                        $rootScope.$apply(function () {
                            $rootScope.$broadcast('dataConnectionClose', {});
                        });
                    });
                    connection.on('data', function (data) {
                        var peerId = this.peer;

                        $rootScope.$apply(function () {
                            if (data.action !== 'readMessage' && data.messageId) {
                                api._connectionMap[peerId].send({action: 'readMessage', id: data.messageId});
                            }
                            /**
                             * @ngdoc event
                             * @name ConnectionGetMessage[action]
                             * @eventOf unchatbar-connection.DataConnection
                             * @eventType broadcast on root scope
                             * @param {String} peerId id of client
                             * @param {Object} message message object
                             * @description
                             *
                             * receive message from client event name is dynamic
                             * `ConnectionGetMessage[data.action]`
                             *
                             */
                            $rootScope.$broadcast('ConnectionGetMessage_' + data.action,
                                {
                                    peerId: peerId,
                                    message: data
                                }
                            );
                        });
                    });
                },

                /**
                 * @ngdoc methode
                 * @name send
                 * @methodOf unchatbar-connection.DataConnection
                 * @params {String} text message text
                 * @params {Array} users users for send group message
                 * @params {String} messageId id from send message before
                 * @description
                 *
                 * send message to active room
                 *
                 */
                send: function (peerId, action, meta, messageId) {
                    var sendId = null, message = {};

                    if (Broker.getPeerId() && Broker.getPeerId() !== peerId) {
                        sendId = messageId || this._createUUID();
                        message.messageId = sendId;
                        message.action = action;
                        message.meta = meta || {};
                        if (this._connectionMap[peerId]) {
                            this._connectionMap[peerId].send(message);
                        } else {
                            Broker.connect(peerId);
                        }
                        this._addToQueue(peerId, message);

                    }
                    return sendId;

                },

                /**
                 * @ngdoc methode
                 * @name _createUUID
                 * @methodOf unchatbar-connection.DataConnection
                 * @private
                 * @description
                 *
                 * generate a uui id
                 *
                 */
                _createUUID: function () {
                    function _p8(s) {
                        var p = (Math.random().toString(16) + '000000000').substr(2, 8);
                        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
                    }

                    return _p8() + _p8(true) + _p8(true) + _p8();

                },

                /**
                 * @ngdoc methode
                 * @name sendFromQueue
                 * @methodOf unchatbar-connection.DataConnection
                 * @private
                 * @params {String} peerId id of client
                 * @description
                 *
                 * send message from storage
                 *
                 */
                sendFromQueue: function (peerId) {
                    this._db.queue.where("receiver").equals(peerId).each(function (queue) {
                        this._db.messages.where("messageId").equals(queue.messageId).each(function (message) {
                            if (this._connectionMap[peerId]) {
                                this._connectionMap[peerId].send(message);
                            }
                        }.bind(this));
                    }.bind(this));
                },

                /**
                 * @ngdoc methode
                 * @name removeFromQueue
                 * @methodOf unchatbar-connection.DataConnection
                 * @private
                 * @params {String} peerId id of client
                 * @returns {Object} messageId message id
                 * @description
                 *
                 * store message, send send later
                 *
                 */
                removeFromQueue: function (peerId, messageId) {
                    this._db.queue.where("messageId").equals(messageId)
                        .and(function (queueItem) {
                            return queueItem.receiver === peerId;
                        })
                        .delete().then(function() {
                            this._db.queue.where("messageId").equals(messageId).count().then(function (count) {
                                if (count === 0) {
                                    this._db.messages.where("messageId").equals(messageId).delete();
                                }
                            }.bind(this));
                        }.bind(this));
                },
                /**
                 * @ngdoc methode
                 * @name _addToQueue
                 * @methodOf unchatbar-connection.DataConnection
                 * @private
                 * @params {String} peerId id of client
                 * @returns {Object} message object
                 * @description
                 *
                 * store message, send send later
                 *
                 */
                _addToQueue: function (peerId, message) {
                    this._db.queue.add({messageId: message.messageId, receiver: peerId});
                    this._db.messages.where("messageId").equals(message.messageId).count().then(function (count) {
                        if (count === 0) {
                            this._db.messages.add(message);
                        }
                    }.bind(this));
                }

            };

            return api;
        }

    ]);

