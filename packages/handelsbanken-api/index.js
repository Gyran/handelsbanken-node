const https = require('https');

const clientCreator = (
  clientId,
  host = 'sandbox.handelsbanken.com',
) => {
  const createHeaders = (headers = {}) => {
    return {
      'X-IBM-Client-Id': clientId,
      'accept': 'application/json',
      ...headers,
    };
  };

  const get = async (options) => {
    return new Promise((resovle, reject) => {
      let data = '';

      const request = https.request({
        method: 'get',
        port: 443,

        host,

        ...options,
      }, (response) => {
        response.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on('end', () => {
          try {
            const out = JSON.parse(data);
            resovle(out);
          } catch (error) {
            reject(error);
          } finally {

          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.end();
    });
  };


  const client = {};

  const accounts = {};
  accounts.list = async ({
    authorization,
    psuIpAddress,
    tppTransactionId,
    tppRequestId,
  }) => {
    const data = await get({
      path: '/openbanking/psd2/v1/accounts',

      headers: createHeaders({
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
    const data = await get({
      path: `/openbanking/psd2/v1/accounts/${ accountId }`,

      headers: createHeaders({
        'Authorization': authorization,
        'TPP-Transaction-ID': tppTransactionId,
        'TPP-Request-ID': tppTransactionId,
        'PSU-IP-Address': psuIpAddress,
      }),
    });

    return data;
  };

  client.accounts = accounts;

  return Object.freeze(client);
};

module.exports = clientCreator;
