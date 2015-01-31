'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar-connection.Connection
 * @require $rootScope
 * @require Broker
 * @description
 *
 * Wrapper for window.peer lib
 *
 */
angular.module('unchatbar-connection')
    .service('Connection', ['$rootScope','Broker',
        function ($rootScope,Broker) {


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
                 * @name send
                 * @methodOf unchatbar-connection.Connection
                 * @params {String} id client peerId
                 * @params {String} message message for client
                 * @return {Boolean} send to client was successfully
                 * @description
                 *
                 * send message to client
                 *
                 */
                send: function (id, message) {
                    if (this._connectionMap[id]) {
                        this._connectionMap[id].send(message);
                    } else {
                        Broker.connect(id);
                    }
                },

                /**
                 * @ngdoc methode
                 * @name getMap
                 * @methodOf unchatbar-connection.Connection
                 * @return {Object} list of all active client connections
                 * @description
                 *
                 * get map of all client connections
                 *
                 */
                getMap : function () {
                    return this._connectionMap;
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
                }
            };
            return api;
        }
    ]);

