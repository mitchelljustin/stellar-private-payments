"use strict";

const request = require('request-promise')

module.exports = class RingMaker {

    constructor({redis, pmtSize, ringSize, stdout}) {
        this._redis = redis
        this._pmtSize = pmtSize
        this._ringSize = ringSize
        this._invokeLambda = stdout
    }

    runForever() {
        console.log(`Making rings of size ${this._ringSize} for ${this._pmtSize}XLM payments `)
        this._ring = []
        this._addNextPayment()
            .catch((e) => {
                console.error(`FATAL ERROR: ${e}`)
            })
    }

    _addNextPayment() {
        console.log(`Adding next payment to ring of size ${this._ringSize}`)
        return this._redis.blpopAsync(`pmtSize:${this._pmtSize}:queue`, 0)
            .then(([_, pmtId]) => {
                this._ring.push(pmtId)
                if (this._ring.length === this._ringSize) {
                    this._flushRing()
                }
                return this._addNextPayment()
            })
    }

    _flushRing() {
        let ring = this._ring
        this._ring = []
        console.log(`Flushing ring with ${this._ringSize} payments: ${ring}`)
        let body = {
            paymentIds: ring,
        };
        if (this._stdout) {
            console.log(`Body: ${JSON.stringify(body, null, 2)}`)
        } else {

        }
    }
}