'use strict';

class PaymentRequestError extends Error {
    constructor(message) {
        super();
        Error.captureStackTrace(this, PaymentRequestError);
        this.name = 'PaymentRequestError';
        this.message = message;
    }
}

module.exports = PaymentRequestError;