const get = require('./get');

const shbCreator = (
  clientId,
  host = 'sandbox.handelsbanken.com',
) => {
  const _get = async (options) => get({
    host,
    ...options,
  });


  const _createHeaders = (headers = {}) => {
    return {
      'X-IBM-Client-Id': clientId,
      'accept': 'application/json',
      ...headers,
    };
  };

  const shb = {};

  const accounts = {};
  accounts.list = async ({
    authorization,
    psuIpAddress,
    tppTransactionId,
    tppRequestId,
  }) => {
    const data = await _get({
      path: '/openbanking/psd2/v1/accounts',

      headers: _createHeaders({
        'Authorization': authorization,
        'TPP-Transaction-ID': tppTransactionId,
        'TPP-Request-ID': tppTransactionId,
        'PSU-IP-Address': psuIpAddress,
      }),
    });

    return data.accounts;
  };

  accounts.reterive = async ({
    authorization,
    psuIpAddress,
    tppTransactionId,
    tppRequestId,

    accountId,
  }) => {
    const data = await _get({
      path: `/openbanking/psd2/v1/accounts/${ accountId }`,

      headers: _createHeaders({
        'Authorization': authorization,
        'TPP-Transaction-ID': tppTransactionId,
        'TPP-Request-ID': tppTransactionId,
        'PSU-IP-Address': psuIpAddress,
      }),
    });

    return data;
  };

  accounts.reteriveBalances = async ({
    authorization,
    psuIpAddress,
    tppTransactionId,
    tppRequestId,

    accountId,
  }) => {
    const data = await _get({
      path: `/openbanking/psd2/v1/accounts/${ accountId }/balances`,

      headers: _createHeaders({
        'Authorization': authorization,
        'TPP-Transaction-ID': tppTransactionId,
        'TPP-Request-ID': tppTransactionId,
        'PSU-IP-Address': psuIpAddress,
      }),
    });

    return data.balances;
  };

  accounts.reteriveTransactions = async ({
    authorization,
    psuIpAddress,
    tppTransactionId,
    tppRequestId,

    accountId,
  }) => {
    const data = await _get({
      path: `/openbanking/psd2/v1/accounts/${ accountId }/transactions`,

      headers: _createHeaders({
        'Authorization': authorization,
        'TPP-Transaction-ID': tppTransactionId,
        'TPP-Request-ID': tppTransactionId,
        'PSU-IP-Address': psuIpAddress,
      }),
    });

    return data.transactions;
  };

  shb.accounts = accounts;

  return Object.freeze(shb);
};

module.exports = shbCreator;
