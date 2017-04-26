"use strict";

const util = require('util');
const querystring = require('querystring');
const request = require('request');
const base = require('./api');

class Wallet {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    sendAuthenticatedRequest(params, callback) {
        params.headers = {
            Authorization: 'Bearer ' + this.accessToken
        };
        base.sendUnauthenticatedRequest(params, callback);
    }

    accountInfo(callback) {
        this.sendAuthenticatedRequest({
            url: '/api/account-info'
        }, callback);
    }

    operationHistory(options, callback) {
        this.sendAuthenticatedRequest({
            url: '/api/operation-history',
            data: options
        }, callback);
    }

    operationDetails(operation_id, callback) {
        this.sendAuthenticatedRequest({
            url: '/api/operation-details',
            data: { operation_id: operation_id }
        }, callback);
    }

    requestPayment(options, callback) {
        this.sendAuthenticatedRequest({
            url: '/api/request-payment',
            data: options
        }, callback);
    }
    processPayment(options, callback) {
        this.sendAuthenticatedRequest({
            url: '/api/process-payment',
            data: options
        }, callback);
    }

    incomingTransferAccept(operation_id, protectionCode, callback) {
        this.sendAuthenticatedRequest({
            url: '/api/incoming-transfer-accept',
            data: {
                operation_id: operation_id,
                protection_code: protectionCode || undefined
            }
        }, callback);
    }

    incomingTransferReject(operation_id, callback) {
        this.sendAuthenticatedRequest({
            url: '/api/incoming-transfer-reject',
            data: {
                operation_id: operation_id,
            }
        }, callback);
    }

    static buildObtainTokenUrl(clientId, redirectURI, scope) {
        var query_string = querystring.stringify({
            client_id: clientId,
            redirect_uri: redirectURI,
            scope: scope.join(' '),
            response_type: "code"
        });
        return util.format("%s/oauth/authorize?%s", base.Config.SP_MONEY_URL, query_string);
    }

    static getAccessToken(clientId, code, redirectURI, clientSecret, callback) {
        var full_url = base.Config.SP_MONEY_URL + "/oauth/token";
        request.post({
            "url": full_url,
            "form": {
                "code": code,
                "client_id": clientId,
                "redirect_uri": redirectURI,
                "client_secret": clientSecret
            }
        }, base.processResponse(callback));
    }
    
    static revokeToken(token, revoke_all, callback) {
        base.sendUnauthenticatedRequest({
            url: '/api/revoke',
            data: {
                'revoke_all': revoke_all
            },
            headers: {
                Authorization: 'Bearer ' + token
            }
        }, callback);
    }
}
module.exports = Wallet;