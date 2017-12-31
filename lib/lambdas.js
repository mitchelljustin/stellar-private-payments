"use strict";

const mixer = require('./mixer')

let lambdaMap = {}

const mixerMethods = [
    'startPrivatePayment',
    'getPrivatePayment',
    'getMixTransaction',
    'signMixTransaction',
]

mixerMethods.forEach((methodName) => {
    const mixerMethod = mixer[methodName].bind(mixer)
    lambdaMap[methodName] = function lambdaHandler(event, context, cb) {
        let args = event.queryStringParameters || JSON.parse(event.body)
        let promise = mixerMethod(args)
        promise
            .then((res) => {
                cb(null, {
                    statusCode: 200,
                    body: res,
                })
            })
            .catch((err) => {
                cb(null, {
                    statusCode: 500,
                    body: err,
                })
            })
    }
})

const defaults = {
    hello(event, context, cb) {
        console.log(JSON.stringify(event, null, 2))
        cb(null, {
            statusCode: 200,
            body: "Hi",
        })
    },
};
module.exports = Object.assign({}, defaults, lambdaMap)