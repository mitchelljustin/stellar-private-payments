"use strict";

const Crypto = require('crypto')

const {Stellar} = require('../integration/stellar')
const Base64 = require('base64-arraybuffer')

const validateParams = require('./validateParams')

module.exports = {
    _genSigHash(privPmt) {
        let missing = validateParams(privPmt, ['source', 'destination', 'size'])
        if (missing.length > 0) {
            throw new Error(`Missing params: ${missing}`)
        }
        let sigbase = `${privPmt.source}:${privPmt.destination}:${privPmt.size}`
        return Crypto.createHash('sha256').update(sigbase).digest()
    },
    sign(privPmt, secretKey) {
        let sigbase = this._genSigHash(privPmt)
        let keypair = Stellar.Keypair.fromSecret(secretKey)
        let signature = keypair.sign(sigbase)
        return Base64.encode(signature)
    },
    verify(privPmt, signature) {
        let sigbase = this._genSigHash(privPmt)
        let pubKey = privPmt.source
        let keypair = Stellar.Keypair.fromPublicKey(pubKey)
        let signature = Base64.decode(signature)
        return keypair.verify(sigbase, signature)
    },
}