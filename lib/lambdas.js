"use strict";

const mixer = require('./mixer')

let lambdaMap = {}

const mixerMethods = [
    'startPrivatePayment',
    'getPrivatePayment',
    'getMixTransaction',
    'postSignedTransaction',
]

mixerMethods.forEach((methodName) => {
    const mixerMethod = mixer[methodName].bind(mixer)
    lambdaMap[methodName] = function lambdaHandler(event, context, cb) {
        let args = JSON.parse(event.body)
        let promise = mixerMethod(args)
        promise
            .then((res) => {
                cb(null, {
                    statusCode: 200,
                    body: JSON.stringify(res),
                })
            })
            .catch((err) => {
                cb(null, {
                    statusCode: 500,
                    body: JSON.stringify(err),
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