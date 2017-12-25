"use strict";

const Database = require('./db');

module.exports = class AccountWatcher {
    constructor(keypair, stellar) {
        this.keypair = keypair;
        this.stellar = stellar;
        this.operationHandlers = {};
        this.db = new Database();
    }

    registerHandler(operationType, operationHandler) {
        this.operationHandlers[operationType] = operationHandler;
    }

    watchForever() {
        this.registerHandler('create_account', (op) => {
            console.log(`Account created: ${op.account}`);
            return Promise.resolve();
        });
        this.registerHandler('payment', this.handlePayment.bind(this));

        this.db.getPagingToken()
            .then((pagingToken) => {
                console.log(`Starting from paging token ${pagingToken}`);
                this.stellar.operations()
                    .forAccount(this.keypair.publicKey())
                    .cursor(pagingToken)
                    .stream({
                        onmessage: this.onOperation.bind(this)
                    });
            });
    }

    handlePayment(pmt) {
        console.log(`Payment: ${pmt}`);
        return Promise.resolve();
    }

    onOperation(op) {
        if (this.operationHandlers[op.type] !== undefined) {
            let handlerPromise = this.operationHandlers[op.type](op);
            handlerPromise.then(() => {
                this.db.setPagingToken(op.paging_token);
                console.log(`Set paging token to ${op.paging_token}`);
            });
        } else {
            console.log(`Unhandled operation of type ${op.type}, token ${op.paging_token}`);
            this.db.setPagingToken(op.paging_token);
        }
    }
};