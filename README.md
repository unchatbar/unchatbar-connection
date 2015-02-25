# Unchatbar Connection
[![Build Status](https://travis-ci.org/unchatbar/unchatbar-connection.svg?branch=master)](https://travis-ci.org/unchatbar/unchatbar-connection)

Peer to peer chat application using WebRTC technologies

## Requirements
* Node.js 0.10+
* Chrome 26+ or Firefox 23+

## Installation
* Install Bower: `npm install -g bower`
* Install Gunt CLI: `npm install -g grunt-cli`
* Clone repository `git clone git://github.com/unchatbar/unchatbar-connection.git`
* Run `npm install` to install required Node.js modules
* Run `bower install` to install required Bower components


## Dependencies
* angular
* json3
* es5-shim
* bootstrap-css-only
* ngstorage
* lodash
* peerjs
* unchatbar-user

## Get Started
```javascript
angular.module('app', ['unchatbar-connection'])
```
## Configure

* configure Broker Host

>
```javascript
BrokerProvider.setHost([HOSTNAME]);
```

* configure Broker Host

>
```javascript
BrokerProvider.addIceServer({
    url : [ICESERVER],
    credential :[CREDENTIAL],
    username : [USERNAME]
});
```

* define secure connection for Broker Server

>
```javascript
BrokerProvider.setSecureConnection([TRUE/FALSE]);
```

* define setPort for Broker Server

>
```javascript
BrokerProvider.setPort([PORT]);
```

* define setPath for Broker Server

>
```javascript
BrokerProvider.setPath([PATH]);
```

* define use lcoal storage, for store peerId

>
```javascript
BrokerProvider.setLocalStorage([TRUE/FALSE]);
```

* define use lcoal storage, for store outstanding messages

>
```javascript
DataConnectionProvider.setLocalStorage([TRUE/FALSE]);
```

## Usage

### Broker

* define peerId for Broker server connection

>
```javascript
BrokerProvider.setPeerId();
```

* connect to Broker server, if no id set in  `setPeerId` , random peerId will create

>
```javascript
BrokerProvider.connectServer();
```

* create Stream channel to client

>
```javascript
BrokerProvider.connectStream([CLIENTID],[STREAM],[METADATA]);
```

* get PeerId for active Broker connection

>
```javascript
BrokerProvider.getPeerId();
```


* get PeerId from client storage

>
```javascript
BrokerProvider.getPeerIdFromStorage();
```

### DataConnection

* send text message to client

>
```javascript
DataConnection.send([CLIENT-PEER-ID],[TEXT-MESSAGE],[ACTION-NAME],[METADATA]);
```


* get all open data connection

>
```javascript
DataConnection.getOpenConnectionMap();
```



## Directive

* get the dialer field to add a new connection to unkown client

>
```html
<un-connection-dialer></un-connection-dialer>
```

* output peer id from user

>
```html
<un-connection-peer-id></un-connection-peer-id>
```

* Broker login from

>
```html
<un-connection-authentication></un-connection-authentication>
```

## Events

* **ConnectionGetMessage_[ACTIONNAME]**: receive new data message from client

* **dataConnectionOpen** : connection to client is open
* **dataConnectionClose** : connection to client is closed

* **BrokerPeerOpen** : connection to broker server is open

* **BrokerPeerCall** : receive stream call

* **BrokerPeerConnection**: try of new data connection
* **BrokerPeerError**: error by Broker server
