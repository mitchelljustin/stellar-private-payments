"use strict";

const Stellar = require('stellar-sdk')

let stellar;
if (process.env.STELLAR_ENV === 'public') {
    Stellar.Network.usePublicNetwork()
    stellar = new Stellar.Server(process.env.HORIZON_URI || 'https://horizon.stellar.org')
} else {
    Stellar.Network.useTestNetwork()
    stellar = new Stellar.Server(process.env.HORIZON_URI || 'https://horizon-testnet.stellar.org')
}

module.exports = {stellar, Stellar}