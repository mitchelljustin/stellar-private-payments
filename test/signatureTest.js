"use strict";

const assert = require('assert')

const signing = require('../lib/helpers/signingPrivPmt')
const {Stellar} = require('../lib/integration/stellar')

const TEST_SECRET = 'SDLKIWCVVUXBUS47O6YVIJCE6NV37RN55ZOLHVO4N2QFRLIODFFUM5KO'

describe('private payment signatures', () => {
    it('should accept valid signatures', () => {
        let keypair = Stellar.Keypair.fromSecret(TEST_SECRET)
        let payment = {
            source: keypair.publicKey(),
            destination: 'GTESTDESTINATION',
            size: '1.0',
        }
        let signature = signing.sign(payment, TEST_SECRET)
        assert.ok(signing.verify({signature, ...payment}), 'signature should be valid')
    })

    it('should reject invalid signatures', () => {
        let keypair = Stellar.Keypair.fromSecret(TEST_SECRET)
        let payment = {
            source: keypair.publicKey(),
            destination: 'GTESTDESTINATION',
            size: '1.0',
        }
        let signature = signing.sign(payment, TEST_SECRET)
        payment.size = '100.0' // Fudge the payment
        assert.ok(!signing.verify({signature, ...payment}), 'signature should not be valid')
    })
})