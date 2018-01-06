"use strict";

const Assert = require('assert')
const BigInt = require('big-integer')

const splitPaymentSize = require('../lib/helpers/splitPaymentSize')

describe('payment splitting module', () => {
    it ('splits up simple payments correctly', () => {
        let paymentSize = '1300000000'
        const denominations = [
            '100e7',
            '25e7',
            '5e7',
        ]
        const sizes = splitPaymentSize({paymentSize, denominations})
        Assert.deepEqual(sizes, [BigInt(100e7), BigInt(25e7), BigInt(5e7)])
    })

    it ('splits up a big payment correctly', () => {
        let paymentSize = '10000000000'
        const denominations = [
            '100e7',
            '25e7',
            '5e7',
        ]
        const sizes = splitPaymentSize({paymentSize, denominations, limit: 10})
        Assert.equal(sizes.length, 10)
        sizes.forEach(size => Assert.deepEqual(size, BigInt('100e7')))
    })

    it ('throws an error when there are too many payment sizes', () => {
        let paymentSize = '10000000000'
        const denominations = [
            '100e7',
            '25e7',
            '5e7',
        ]
        Assert.throws(() => {
            const sizes = splitPaymentSize({paymentSize, denominations, limit: 5})
        })
    })
})