# Redis Connector [![Build Status](https://travis-ci.org/appcelerator/appc.redis.svg?branch=master)](https://travis-ci.org/appcelerator/appc.redis)

This is an Arrow connector for Redis, making available some of the most used features of Redis.

## Installation

```bash
$ appc install connector/appc.redis
```

## Usage

If you wish to simply use the default Arrow operations, you can create and extend your own models. These models are optimized for faster Redis throughput:

```javascript
var User = Arrow.Model.extend('user', {
	fields: {
		name: { type: String, required: false, validator: /[a-zA-Z]{3,}/ }
	},
	connector: 'appc.redis'
});
```

If you wish to keep the optimized models, but use certain generic Redis features, you need to extend the base Redis model.

```javascript
var User = Arrow.Model.extend('appc.redis/base', 'user', {
	fields: {
		name: { type: String, required: false, validator: /[a-zA-Z]{3,}/ }
	}
});
```

If you wish to take advantage of some methods more specific to Redis, in particular expiration, you need to extend the ephemeral Redis model.

```javascript
var User = Arrow.Model.extend('appc.redis/ephemeral', 'user', {
	fields: {
		name: { type: String, required: false, validator: /[a-zA-Z]{3,}/ }
	}
});
```

This provides you with any of the documented Redis methods below.

## Configuration

Example configurations can be found in `conf/`. You can set any of the following on the connector:

* host
	- the hostname of the Redis server to connect to
* port
	- the port to use when connecting to the server
* opts
	- options to be passed directly to [ioredis](https://github.com/luin/ioredis/blob/c67f66a0edefafac134d8e43ffd6532f552d1620/API.md#new_Redis_new)

## Redis Specific Features

The Redis models implement the following Redis-specific methods:

**ids([limit, ]callback)**

> Returns a number of keys for the Model. In essence, this is a list of all primary keys for the Model. The callback receives `err` and an Array of `keys`.

### Ephemeral Model

Ephemeral models gain additional methods related to expiration. Please note that these models use a different storage technique and will be somewhat slower than the base models, so only use them if expiration is required.

**expire(seconds[, callback])**

> Sets an expiration value on the current instance, taking an optional callback. This callback receives two arguments; `err` and `success`. 

**expireAt(date[, callback])**

> Same as the above, but taking a JavaScript `Date` acceptable value (it's passed straight to the constructor), rather than a number of seconds.

**ids([limit, ]callback)**

> Returns a number of keys for the Model. In essence, this is a list of all primary keys for the Model.
> The callback receives `err` and an Array of `keys`.

**persist([callback])**

> Removes an expiration on an instance. This callback receives two arguments; `err` and `success`. 

**ttl(callback)**

> Returns the time-to-live of a given instance, as defined by a previously set expiration. Callback receives `err` and `ttl` (in seconds).

## Development

> This section is for individuals developing the Redis Connector and not intended
  for end-users.

```bash
npm install
node app.js
```

### Running Unit Tests

When running the tests remember that appc.redis will use database 15 for testing and *will* empty it. You can override this using the `testDB` environment variable if needed. 

```bash
npm test
```

# Contributing

This project is open source and licensed under the [Apache Public License (version 2)](http://www.apache.org/licenses/LICENSE-2.0).  Please consider forking this project to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request. 

To protect the interests of the contributors, Appcelerator, customers and end users we require contributors to sign a Contributors License Agreement (CLA) before we pull the changes into the main repository. Our CLA is simple and straightforward - it requires that the contributions you make to any Appcelerator open source project are properly licensed and that you have the legal authority to make those changes. This helps us significantly reduce future legal risk for everyone involved. It is easy, helps everyone, takes only a few minutes, and only needs to be completed once. 

[You can digitally sign the CLA](http://bit.ly/app_cla) online. Please indicate your email address in your first pull request so that we can make sure that will locate your CLA.  Once you've submitted it, you no longer need to send one for subsequent submissions.

# Legal Stuff

Appcelerator is a registered trademark of Appcelerator, Inc. Arrow and associated marks are trademarks of Appcelerator. All other marks are intellectual property of their respective owners. Please see the LEGAL information about using our trademarks, privacy policy, terms of usage and other legal information at [http://www.appcelerator.com/legal](http://www.appcelerator.com/legal).
