'use strict';

class PaymentProcessError extends Error {
    constructor(message) {
        super();
        Error.captureStackTrace(this, PaymentProcessError);
        this.name = 'PaymentProcessError';
        this.message = message;
    }
}

module.exports = PaymentProcessError;