'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar-connection.MessageTextProvider
 * @description
 *
 * data connection
 *
 */
angular.module('unchatbar-connection')
    .provider('dataConnection', function () {
        var useLocalStorage = false;

        /**
         * @ngdoc methode
         * @name setLocalStorage
         * @methodOf unchatbar-connection.MessageTextProvider
         * @description
         *
         * use local storage for store messages
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        };

        /**
         * @ngdoc service
         * @name unchatbar-connection.MessageText
         * @require $rootScope
         * @require $sessionStorage
         * @require $localStorage
         * @require Broker
         * @require PhoneBook
         * @require Connection
         * @description
         *
         * store send receive text messages
         *
         */
        this.$get = ['$rootScope', '$localStorage', '$sessionStorage', 'Broker',
            function ($rootScope, $localStorage, $sessionStorage, Broker  ) {


                var api =  {

                    /**
                     * @ngdoc methode
                     * @name _connectionMap
                     * @propertyOf unchatbar-connection.Connection
                     * @private
                     * @returns {Object} connection storage
                     *
                     */
                    _connectionMap : {},

                    /**
                     * @ngdoc methode
                     * @name _storageMessages
                     * @propertyOf unchatbar-connection.Broker
                     * @private
                     * @returns {Object} message storage
                     *
                     */
                    _storageMessages: {
                        queue: {}
                    },

                    /**
                     * @ngdoc methode
                     * @name initStorage
                     * @methodOf unchatbar-connection.MessageText
                     * @description
                     *
                     * init storage
                     */
                    initStorage: function () {
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        this._storageMessages = storage.$default({
                            dataConnection: {
                                queue: {}
                            }
                        }).dataConnection;
                    },

                    /**
                     * @ngdoc methode
                     * @name add
                     * @methodOf unchatbar-connection.Connection
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
                             * @eventOf unchatbar-connection.Connection
                             * @eventType broadcast on root scope
                             * @param {String} peerId id of client
                             * @description
                             *
                             * new connection to client is open
                             *
                             */
                            $rootScope.$broadcast('ConnectionOpen', {peerId: this.peer});
                        });
                        connection.on('close', function () {
                            delete api._connectionMap[this.peer];
                        });
                        connection.on('data', function (data) {
                            var  peerId = this.peer;

                            $rootScope.$apply(function () {
                                if(data.action !== 'readMessage' && data.id) {
                                    api.send(peerId, {action: 'readMessage', id: data.id});
                                }
                                /**
                                 * @ngdoc event
                                 * @name ConnectionGetMessage[action]
                                 * @eventOf unchatbar-connection.Connection
                                 * @eventType broadcast on root scope
                                 * @param {String} peerId id of client
                                 * @param {Object} message message object
                                 * @description
                                 *
                                 * receive message from client event name is dynamic
                                 * `ConnectionGetMessage[data.action]`
                                 *
                                 */
                                $rootScope.$broadcast('ConnectionGetMessage' + data.action,
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
                     * @methodOf unchatbar-connection.MessageText
                     * @params {String} text message text
                     * @params {Array} users users for send group message
                     * @description
                     *
                     * send message to active room
                     *
                     */
                    send: function (peerId,text,action) {
                        var message = {};
                        message.text = text;
                        message.id =  this._createUUID();
                        message.action =  action;
                        if (this._connectionMap[peerId]) {
                            this._connectionMap[peerId].send(message);
                        } else {
                            Broker.connect(peerId);
                        }
                        this._addToQueue(user.id, message);
                    },

                    /**
                     * @ngdoc methode
                     * @name _createUUID
                     * @methodOf unchatbar-connection.MessageText
                     * @private
                     * @description
                     *
                     * generate a uui id
                     *
                     */
                    _createUUID : function() {
                        function _p8(s) {
                            var p = (Math.random().toString(16)+'000000000').substr(2,8);
                            return s ? '-' + p.substr(0,4) + '-' + p.substr(4,4) : p ;
                        }
                        return _p8() + _p8(true) + _p8(true) + _p8();

                    },

                    /**
                     * @ngdoc methode
                     * @name sendFromQueue
                     * @methodOf unchatbar-connection.MessageText
                     * @private
                     * @params {String} peerId id of client
                     * @description
                     *
                     * send message from storage
                     *
                     */
                    sendFromQueue: function (peerId) {
                        if (this._storageMessages.queue[peerId]) {
                            _.forEach(this._storageMessages.queue[peerId], function (message) {
                                Connection.send(peerId, message);
                            }.bind(this));
                        }
                    },


                    /**
                     * @ngdoc methode
                     * @name sendFromQueue
                     * @methodOf unchatbar-connection.MessageText
                     * @private
                     * @params {String} peerId id of client
                     * @description
                     *
                     * send message from storage
                     *
                     */
                    removeFromQueue: function (peerId,messageId) {
                        if (this._storageMessages.queue[peerId] &&
                            this._storageMessages.queue[peerId][messageId]
                        ) {
                            delete this._storageMessages.queue[peerId][messageId];
                        }
                        if (_.size(this._storageMessages.queue[peerId]) === 0) {
                            delete this._storageMessages.queue[peerId];
                        }
                    },


                    /**
                     * @ngdoc methode
                     * @name _addToQueue
                     * @methodOf unchatbar-connection.MessageText
                     * @private
                     * @params {String} peerId id of client
                     * @returns {Object} message object
                     * @description
                     *
                     * store message, send send later
                     *
                     */
                    _addToQueue: function (peerId, message) {
                        if (!this._storageMessages.queue[peerId]) {
                            this._storageMessages.queue[peerId] = {};
                        }
                        this._storageMessages.queue[peerId][message.id] = message;
                    }

                };

                return api;
            }
        ];
    }
);
