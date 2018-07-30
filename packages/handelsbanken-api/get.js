const https = require('https');

const get = async options => {
  return new Promise((resovle, reject) => {
    let data = '';

    const request = https.request(
      {
        method: 'get',
        port: 443,

        ...options,
      },
      response => {
        response.on('data', chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on('end', () => {
          try {
            const out = JSON.parse(data);
            resovle(out);
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on('error', error => {
      reject(error);
    });

    request.end();
  });
};

module.exports = get;
