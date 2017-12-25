"use strict";
const Redis = require('redis');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);

module.exports = class Database {
    constructor() {
        this.redis = new Redis.RedisClient({
            host: 'redis',
        });
        console.log("Connected to Redis")
    }

    setPagingToken(pagingToken) {
        return this.redis.setAsync('paging_token', pagingToken);
    }

    getPagingToken() {
        return this.redis.getAsync('paging_token');
    }


};