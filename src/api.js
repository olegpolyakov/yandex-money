'use strict';

const request = require('request');

const config = {
    MONEY_URL: 'https://money.yandex.ru',
    SP_MONEY_URL: 'https://sp-money.yandex.ru'
};

function getInstanceId(clientId) {
    return sendUnauthenticatedRequest({
        url: '/api/instance-id',
        data: {
            client_id: clientId
        }
    })
    .then(response => {
        if (response.status === 'refused') throw new Error(response.error);
        return response.instance_id;
    });
}

function sendUnauthenticatedRequest(params) {
    let headers = params.headers || {};
    let url = params.url;
    let data = params.data || {};

    headers['User-Agent'] = 'Yandex.Money.SDK/NodeJS';

    return new Promise((resolve, reject) => {
        request.post({
            url: config.MONEY_URL + url,
            headers: headers,
            form: data,
        }, processResponse(resolve, reject));
    });
}

function processResponse(resolve, reject) {
    return function httpCallback(error, response, body) {
        if (error) {
            reject(error);
            return;
        }
        switch (response.statusCode) {
            case 400:
                reject(new Error('Format error'));
                break;
            case 401:
                reject(new Error('Token error'));
                break;
            case 403:
                reject(new Error('Scope error'));
                break;
            default:
                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(new Error(error.message));
                }
        }
    };
}

module.exports = {
    getInstanceId,
    sendUnauthenticatedRequest
};