'use strict';

const api = require('./api');
const PaymentRequestError = require('./errors/payment-request-error');
const PaymentProcessError = require('./errors/payment-process-error');

function request(data) {
    return api.sendUnauthenticatedRequest({
        url: '/api/request-external-payment',
        data
    })
    .then(response => {
        if (response.status == 'refused') {
            throw handleRequestError(response.error);
        } else {
            return response;
        }
    });
}

function process(data) {
    return api.sendUnauthenticatedRequest({
        url: '/api/process-external-payment',
        data
    })
    .then(response => {
        if (response.status == 'refused') {
            throw handleProcessError(response.error);
        } else {
            return response;
        }
    });
}

function handleRequestError(error) {
    let message = '';

    switch(error) {
        case 'illegal_param_to': message = 'Недопустимое значение параметра to.';
            break;
        case 'illegal_param_amount': message = 'Недопустимое значение параметра amount.';
            break;
        case 'illegal_param_amount_due': message = 'Недопустимое значение параметра amount_due.';
            break;
        case 'illegal_param_message': message = 'Недопустимое значение параметра message.';
            break;
        case 'payee_not_found': message = 'Получатель не найден, указанный счет не существует.';
            break;
        case 'payment_refused': message = 'Магазин отказал в приеме платежа.';
            break;
        default: message = 'Обязательные параметры платежа отсутствуют, имеют недопустимые значения или логические противоречия.';
    }

    return new PaymentRequestError(message);
}

function handleProcessError(error) {
    let message = '';

    switch (error) {
        case 'illegal_param_request_id': message = 'Неверное значение request_id или отсутствует контекст с заданным request_id';
            break;
        case 'illegal_param_csc': message = 'Отсутствует или указано недопустимое значение параметра csc.';
            break;
        case 'illegal_param_instance_id': message = 'Отсутствует или указано недопустимое значение параметра instance_id.';
            break;
        case 'illegal_param_money_source_token': message = 'Отсутствует или указано недопустимое значение параметра money_source_token, токен отозван или истек его срок действия.';
            break;
        case 'payment_refused': message = 'В платеже отказано.';
            break;
        case 'authorization_reject': message = 'В авторизации платежа отказано.';
            break;
        case 'illegal_param_ext_auth_success_uri': message = 'Отсутствует или указано недопустимое значение параметра ext_auth_success_uri.';
            break;
        case 'illegal_param_ext_auth_fail_uri': message = 'Отсутствует или указано недопустимое значение параметра ext_auth_fail_uri.';
            break;
    }

    return new PaymentProcessError(message);
}

module.exports = {
    request,
    process
};