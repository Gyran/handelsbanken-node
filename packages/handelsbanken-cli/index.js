const shbPackage = require('handelsbanken-api');
const publicIp = require('public-ip');
const inquirer = require('inquirer');

const doit = async () => {
  const { clientId, authorization } = await inquirer.prompt([
    {
      type: 'input',
      name: 'clientId',
      message: 'Client ID',
    },
    {
      type: 'input',
      name: 'authorization',
      message: 'Authorization',
    },
  ]);

  const shb = shbPackage(clientId);

  const ip = await publicIp.v4();

  const accounts = await shb.accounts.list({
    authorization,
    psuIpAddress: ip,
    tppRequestId: 'asd',
    tppTransactionId: 'cvb',
  });

  const { accountId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'accountId',
      message: 'Pick an account',
      choices: accounts.map(a => {
        return {
          name: a.name,
          value: a.accountId,
        };
      }),
    },
  ]);

  const account = await shb.accounts.reterive({
    authorization,
    psuIpAddress: ip,
    tppRequestId: 'asd',
    tppTransactionId: 'cvb',

    accountId,
  });

  console.log('acc', account);
};

doit();
