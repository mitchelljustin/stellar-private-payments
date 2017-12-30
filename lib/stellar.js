"use strict";

const Stellar = require('stellar-sdk')
const stellarEnv = process.env.STELLAR_ENV || 'test'
let stellar;

if (stellarEnv === 'public') {
    Stellar.Network.usePublicNetwork()
    stellar = new Stellar.Server('https://horizon.stellar.org')
} else {
    Stellar.Network.useTestNetwork()
    stellar = new Stellar.Server('https://horizon-testnet.stellar.org')
}

module.exports = stellar