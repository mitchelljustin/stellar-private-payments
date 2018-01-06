"use strict";

const Redis = require('redis')

const client = Redis.createClient({
    url: process.env.REDIS_URI || 'redis://127.0.0.1:6379',
})

module.exports = client
