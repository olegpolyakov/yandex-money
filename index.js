'use strict';

const Wallet = require('./src/wallet');
const Payment = require('./src/payment');
const getInstanceId = require('./src/api').getInstanceId;

module.exports = {
    Wallet,
    Payment,
    getInstanceId
};