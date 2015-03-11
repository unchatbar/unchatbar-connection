'use strict';

/**
 * @author Lars Wiedemann
 * @ngdoc service
 * @name unchatbar-connection.BrokerProvider
 * @description
 * # peer
 * config peer connection
 */
angular.module('unchatbar-connection')
    .provider('Broker', function () {

        var host = '',
            port = '',
            path = '',
            useLocalStorage = false,
            useSecureConnection = false,
            brokerDebugLevel = 0,
            iceServer = [];

        /**
         * @ngdoc methode
         * @name setHost
         * @methodOf unchatbar-connection.BrokerProvider
         * @params {String} _host set host from peer server
         * @description
         *
         * set peer server host
         *
         */
        this.setHost = function (_host) {
            host = _host;
        };

        /**
         * @ngdoc methode
         * @name addIceServer
         * @methodOf unchatbar-connection.BrokerProvider
         * @params {Object} server ice server
         * @description
         *
         * add ice server
         *
         */
        this.addIceServer = function (server) {
            iceServer.push(server);
        };

        /**
         * @ngdoc methode
         * @name setSecureConnection
         * @methodOf unchatbar-connection.BrokerProvider
         * @params {Boolean} _useSecureConnection set use secure connection
         * @description
         *
         * set secure connection for broker server
         *
         */
        this.setSecureConnection = function (_useSecureConnection) {
            useSecureConnection = _useSecureConnection ? true : false;
        };

        /**
         * @ngdoc methode
         * @name setSecureConnection
         * @methodOf unchatbar-connection.BrokerProvider
         * @params {Number} _brokerDebug debug level
         * @description
         *
         * set broker debug level
         *
         */
        this.setBrokerDebugLevel = function (_brokerDebugLevel) {
            brokerDebugLevel = _brokerDebugLevel;
        };


        /**
         * @ngdoc methode
         * @name setPort
         * @methodOf unchatbar-connection.BrokerProvider
         * @params {Number} port set port for peer server
         * @description
         *
         * set peer server port
         *
         */
        this.setPort = function (_port) {
            port = _port;
        };

        /**
         * @ngdoc methode
         * @name setPath
         * @methodOf unchatbar-connection.BrokerProvider
         * @params {String} path set path from peerServer
         * @description
         *
         * # peer
         * set path for peer server
         *
         */
        this.setPath = function (_path) {
            path = _path;
        };

        /**
         * @ngdoc methode
         * @name setLocalStorage
         * @methodOf unchatbar-connection.BrokerProvider
         * @description
         *
         * use local storage for store peerId
         *
         */
        this.setLocalStorage = function () {
            useLocalStorage = true;
        };


        /**
         * @ngdoc service
         * @name unchatbar-connection.Broker
         * @require $rootScope
         * @require $sessionStorage
         * @require $modal
         * @require $localStorage
         * @require Peer
         * @description
         *
         * peer service
         */
        this.$get = ['$rootScope','$timeout', '$localStorage', '$sessionStorage', '$modal', 'Peer',
            function ($rootScope, $timeout,$localStorage, $sessionStorage, $modal, peerService) {
                //TODO ON VIEW CHANGE START connectServer
                var api = {

                    /**
                     * @ngdoc methode
                     * @name _storage
                     * @propertyOf unchatbar-connection.Broker
                     * @private
                     * @returns {Object} broker storage
                     *
                     */
                    _storage: {
                        peerId: ''
                    },

                    /**
                     * @ngdoc methode
                     * @name authenticationError
                     * @propertyOf unchatbar-connection.Broker
                     * @private
                     * @returns {Boolean} is authentication error
                     *
                     */
                    authenticationError :false,
                    /**
                     * @ngdoc methode
                     * @name initStorage
                     * @methodOf unchatbar-connection.Broker
                     * @description
                     *
                     * init storage
                     *
                     */
                    initStorage: function () {
                        var storage = useLocalStorage ? $localStorage : $sessionStorage;
                        this._storage = storage.$default({
                            broker: {
                                peerId: '',
                                pass: ''
                            }
                        }).broker;
                    },

                    /**
                     * @ngdoc methode
                     * @name _generateNewPass
                     * @methodOf unchatbar-connection.Broker
                     * @return {String} new password
                     * @description
                     *
                     * create new password
                     *
                     */
                    _generateNewPass: function () {
                        return Math.random().toString(36).substr(2);
                    },

                    /**
                     * @ngdoc methode
                     * @name destroyServerConnection
                     * @methodOf unchatbar-connection.Broker
                     * @description
                     *
                     * destroy connection
                     *
                     */
                    destroyServerConnection : function(){
                        if(this.getPeerId()) {
                            peerService.get().destroy();
                        }
                    },
                    /**
                     * @ngdoc methode
                     * @name connectServer
                     * @methodOf unchatbar-connection.Broker
                     * @description
                     *
                     * connect to server
                     *
                     */
                    connectServer: function () {
                        if (!this._storage.pass) {
                            this._storage.pass = this._generateNewPass();
                        }
                        api.authenticationError = false;

                        peerService.init(this._storage.peerId, {
                            host: host,
                            port: port,
                            path: path,
                            meta: {
                                pass: this._storage.pass
                            },
                            config: {'iceServers': iceServer},
                            secure: useSecureConnection,
                            debug: brokerDebugLevel
                        });
                        this._peerListener();
                    },

                    /**
                     * @ngdoc methode
                     * @name connect
                     * @methodOf unchatbar-connection.Broker
                     * @params {String} id client id
                     * @description
                     *
                     * connect to client
                     *
                     */
                    connect: function (id) {
                        var connection = peerService.get().connect(id, {reliable: true});
                        if (connection) {
                            $rootScope.$broadcast('BrokerPeerConnection', {
                                connection: connection
                            });
                        }
                    },

                    /**
                     * @ngdoc methode
                     * @name connectStream
                     * @methodOf unchatbar-connection.Broker
                     * @params {String} id client id
                     * @params {String} id client id
                     * @params {Object} streamOption audio/video option
                     * @description
                     *
                     * connect a stream to client
                     *
                     */
                    connectStream: function (id, stream, metaData) {
                        var streamCall = peerService.get().call(id, stream, {metadata: metaData});
                        return streamCall;
                    },

                    /**
                     * @ngdoc methode
                     * @name setPeerId
                     * @methodOf unchatbar-connection.Broker
                     * @params {String} peerId peerId
                     * @return {String} own peer id
                     * @description
                     *
                     * set peer id
                     *
                     */
                    setPeerId: function (peerId) {
                        api._storage.peerId = peerId;
                    },
                    /**
                     * @ngdoc methode
                     * @name getPeerId
                     * @methodOf unchatbar-connection.Broker
                     * @return {String} own peer id
                     * @description
                     *
                     * get peer id
                     *
                     */
                    getPeerId: function () {
                        return peerService.get().id || '';
                    },

                    /**
                     * @ngdoc methode
                     * @name getPass
                     * @methodOf unchatbar-connection.Broker
                     * @return {String} own peer id
                     * @description
                     *
                     * get password for client
                     *
                     */
                    getPass: function () {
                        return this._storage.pass;
                    },

                    /**
                     * @ngdoc methode
                     * @name setPass
                     * @methodOf unchatbar-connection.Broker
                     * @return {String} own peer id
                     * @description
                     *
                     * set password for client
                     *
                     */
                    setPass: function (pass) {
                        this._storage.pass = pass;
                    },

                    /**
                     * @ngdoc methode
                     * @name getPeerIdFromStorage
                     * @methodOf unchatbar-connection.Broker
                     * @return {String} own peer id
                     * @description
                     *
                     * get peer id from storage
                     *
                     */
                    getPeerIdFromStorage: function () {
                        return this._storage.peerId;
                    },

                    /**
                     * @ngdoc methode
                     * @name _isBrowserOnline
                     * @methodOf unchatbar-connection.Broker
                     * @returns {Boolean} navigator.onLine
                     * @description
                     *
                     * helper for is browser online
                     *
                     */
                    _isBrowserOnline: function () {
                        return navigator.onLine;
                    },

                    /**
                     * @ngdoc methode
                     * @name _peerListener
                     * @methodOf unchatbar-connection.Broker
                     * @private
                     * @description
                     *
                     * listen to peer server
                     *
                     */
                    _peerListener: function () {
                        var peer = peerService.get();

                        peer.on('open', function (peerId) {
                            api._onOpen(peerId);
                        });

                        peer.on('call', function (call) {
                            api._onCall(call);
                        });

                        peer.on('connection', function (connection) {
                            api._onConnection(connection);
                        });

                        peer.on('disconnected', function (connection) {
                            api._onDisconnect(connection);
                        });

                        peer.on('close', function (connection) {
                            api._onClose(connection);
                        });

                        peer.on('error', function (error) {
                            if (error.message === 'Unauthorized') {
                                api.authenticationError= true;
                                api._handleFailedLogin();
                            }
                            api._onError(error);
                        });

                    },

                    /**
                     * @ngdoc methode
                     * @name _onOpen
                     * @methodOf unchatbar-connection.Broker
                     * @params {String} peerId peerId
                     * @description
                     *
                     * handle peer open
                     *
                     */
                    _handleFailedLogin: function () {
                        var modalInstance = $modal.open({
                            templateUrl: 'views/unchatbar-connection/failed-login.html',
                            controller: 'modelPassword'
                        });
                    },
                    /**
                     * @ngdoc methode
                     * @name _onOpen
                     * @methodOf unchatbar-connection.Broker
                     * @params {String} peerId peerId
                     * @description
                     *
                     * handle peer open
                     *
                     */
                    _onOpen: function (peerId) {
                        $rootScope.$apply(function () {
                            api.setPeerId(peerId);
                            /**
                             * @ngdoc event
                             * @name BrokerPeerOpen
                             * @eventOf unchatbar-connection.Broker
                             * @eventType broadcast on root scope
                             * @description
                             *
                             * Broadcasted after peer server connection is open
                             *
                             * @param {String} id own peer id
                             */
                            $rootScope.$broadcast('BrokerPeerOpen', {id: peerId});
                        });
                    },
                    /**
                     * @ngdoc methode
                     * @name _onCall
                     * @methodOf unchatbar-connection.Broker
                     * @params {Object} call connection
                     * @description
                     *
                     * handle peer call
                     *
                     */
                    _onCall: function (call) {
                        $rootScope.$apply(function () {

                            /**
                             * @ngdoc event
                             * @name BrokerPeerOpen
                             * @eventOf unchatbar-connection.Broker
                             * @eventType broadcast on root scope
                             * @description
                             *
                             * Broadcasted after get client call for stream
                             *
                             * @param {Object} call client call
                             */
                            $rootScope.$broadcast('BrokerPeerCall', {client: call});
                        });
                    },

                    /**
                     * @ngdoc methode
                     * @name _onConnection
                     * @methodOf unchatbar-connection.Broker
                     * @params {Object} connection connection
                     * @description
                     *
                     * handle peer connection
                     *
                     */
                    _onConnection: function (connection) {
                        $rootScope.$apply(function () {
                            /**
                             * @ngdoc event
                             * @name BrokerPeerConnection
                             * @eventOf unchatbar-connection.Broker
                             * @eventType broadcast on root scope
                             * @description
                             *
                             * Broadcasted after client connect
                             *
                             * @param {Object} connection client connection
                             */
                            $rootScope.$broadcast('BrokerPeerConnection', {connection: connection});
                        });
                    },

                    /**
                     * @ngdoc methode
                     * @name _onConnection
                     * @methodOf unchatbar-connection.Broker
                     * @params {Object} error connection
                     * @description
                     *
                     * handle peer error
                     *
                     */
                    _onError: function (error) {
                        /**
                         * @ngdoc event
                         * @name BrokerPeerError
                         * @eventOf unchatbar-connection.Broker
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * Broadcasted after error in peer conncetion
                         *
                         * @param {Object} error error object
                         */
                        $rootScope.$broadcast('BrokerPeerError', {error: error});

                    },

                    /**
                     * @ngdoc methode
                     * @name _onConnection
                     * @methodOf unchatbar-connection.Broker
                     * @params {Object} error connection
                     * @description
                     *
                     * handle close connection to broker
                     *
                     */
                    _onClose: function () {
                        /**
                         * @ngdoc event
                         * @name BrokerPeerClose
                         * @eventOf unchatbar-connection.Broker
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * Broadcasted after close in peer conncetion
                         *
                         * @param {Object} error error object
                         */
                        $rootScope.$broadcast('BrokerPeerClose', {});

                        if(api.getPeerIdFromStorage() && api.authenticationError === false) {
                            api.connectServer();
                        };
                    },

                    /**
                     * @ngdoc methode
                     * @name _onDisconnect
                     * @methodOf unchatbar-connection.Broker
                     * @params {Object} error connection
                     * @description
                     *
                     * handle diconnect connection to broker
                     *
                     */
                    _onDisconnect: function () {
                        /**
                         * @ngdoc event
                         * @name BrokerPeerDisconnect
                         * @eventOf unchatbar-connection.Broker
                         * @eventType broadcast on root scope
                         * @description
                         *
                         * Broadcasted after disconnect in peer conncetion
                         *
                         * @param {Object} error error object
                         */
                        $rootScope.$broadcast('BrokerPeerDisconnect', {});
                        if (api._isBrowserOnline() && api.authenticationError === false) {
                           $timeout(function(){
                               peerService.get().reconnect();
                           },300)

                        }
                    }


                };

                return api;
            }
        ];
    }
);
