# Unchatbar Connection
[![Build Status](https://travis-ci.org/unchatbar/unchatbar-connection.svg?branch=master)](https://travis-ci.org/unchatbar/unchatbar)

Peer to peer chat application using WebRTC technologies

## Requirements
* Node.js 0.10+
* Chrome 26+ or Firefox 23+

## Installation
* Install Bower: `npm install -g bower`
* Install Gunt CLI: `npm install -g grunt-cli`
* Clone repository `git clone git://github.com/unchatbar/unchatbar.git`
* Run `npm install` to install required Node.js modules
* Run `bower install` to install required Bower components
## Get Started
```javascript
angular.module('app', ['unchatbar-connection'])
```
## Configure
* configure Broker Host
```javascript
BrokerProvider.setHost([HOSTNAME]);
```
* configure Broker Host
```javascript
BrokerProvider.addIceServer({
    url : [ICESERVER],
    credential :[CREDENTIAL],
    username : [USERNAME]
});
```
* define secure connection for Broker Server
```javascript
BrokerProvider.setSecureConnection([TRUE/FALSE]);
```

* define setPort for Broker Server
```javascript
BrokerProvider.setPort([PORT]);
```
* define setPath for Broker Server
```javascript
BrokerProvider.setPath([PATH]);
```
* define use lcoal storage, for store peerId
 ```javascript
BrokerProvider.setLocalStorage([TRUE/FALSE]);
```

## Usage
* define peerId for Broker server connection
 ```javascript
    BrokerProvider.setPeerId();
```

* connect to Broker server, if no id set in  `setPeerId` , random peerId will create
 ```javascript
    BrokerProvider.connectServer();
```

* create Data channel to client
```javascript
    BrokerProvider.connect([CLIENTID]);
```

* create Stream channel to client
```javascript
    BrokerProvider.connectStream([CLIENTID],[STREAM],[METADATA]);
```
* get PeerId for active Broker connection
```javascript
    BrokerProvider.getPeerId();
```
* get PeerId from client storage
```javascript
    BrokerProvider.getPeerIdFromStorage();
```
