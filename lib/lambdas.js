"use strict";

module.exports = {
    hello (event, context, cb) {
        cb(null, {
            statusCode: 200,
            body: "Hi",
        })
    }
}