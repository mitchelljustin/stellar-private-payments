"use strict";
const Redis = require('redis')
const Bluebird = require('bluebird')
Bluebird.promisifyAll(Redis.RedisClient.prototype)
Bluebird.promisifyAll(Redis.Multi.prototype)

const client = Redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
})

module.exports = client;
