"use strict";
const Stellar = require('stellar-sdk');
const TOML = require('toml');
const FS = require('fs');
const AccountWatcher = require('./lib/accountWatcher');

let configRaw = FS.readFileSync('config.toml');
let config = TOML.parse(configRaw);
let networkName = config.main.network;
let stellarConfig = config.stellar[networkName];
if (stellarConfig === undefined) {
    console.error(`No stellar config for network '${networkName}'`);
    process.exit(1);
}
console.log(`Using network ${networkName}`);
let secret = String(FS.readFileSync(stellarConfig.keyfile));
let keypair = Stellar.Keypair.fromSecret(secret);
console.log(`Using account ${keypair.publicKey()}`);

Stellar.Network.use(new Stellar.Network(stellarConfig.network_passphrase));
const stellar = new Stellar.Server(stellarConfig.horizon_uri);

new AccountWatcher(keypair, stellar).watchForever();