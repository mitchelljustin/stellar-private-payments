"use strict";

const Assert = require('assert')

const generateMixes = require('../lib/helpers/generateMixes')

describe('mix generator', () => {
    it('distributes simple payments correctly', () => {
        let payments = [
            'a/1',
            'b/1',
            'c/1',
            'd/1',
            'e/1',
        ]
        let {mixes, remainingPmts} = generateMixes({payments, paymentsPerMix: 5})
        Assert.deepEqual(mixes, [{payments}])
        Assert.deepEqual(remainingPmts, [])
    })
    it('skips payments correctly', () => {
        let payments = [
            'a/1',
            'd/1',
            'a/2',
            'b/1',
            'c/1',
            'e/1',
        ]
        let {mixes, remainingPmts} = generateMixes({payments, paymentsPerMix: 5})
        Assert.deepEqual(mixes, [{payments: [
            'a/1',
            'd/1',
            'b/1',
            'c/1',
            'e/1',
        ]}])
        Assert.deepEqual(remainingPmts, ['a/2'])
    })
    it('does not create a mix if too few payments', () => {
        let payments = [
            'a/1',
            'd/1',
            'b/1',
            'c/1',
        ]
        let {mixes, remainingPmts} = generateMixes({payments, paymentsPerMix: 5})
        Assert.deepEqual(mixes, [])
        Assert.deepEqual(remainingPmts, payments)
    })
})