/* @flow */
const get = require('./get');

type Currency = string;

type Links = {
  balances: string,
  transactions: string,
};

type Account = {
  accountId: string,
  iban: string,
  currency: Currency,
  accountType: string,
  bic: string,
  clearingNumber: string,
  bban: string,
  name: string,
  _links: Links,
};

type Amount = {
  currency: Currency,
  content: number,
  ledgerDate: string,
  transactionDate: string,
  creditDebet: string,
  remittanceInformation: string,
  balance: Balance,
};

type Balance = {
  balanceType: 'booked' | 'availableAmount',
  amount: Amount,
};

type Transaction = {
  status: 'booked' | 'pending',
  amount: Amount,
};

type BaseApiOptionsType = {
  authorization: string,
  psuIpAddress: string,
  tppTransactionId: string,
  tppRequestId: string,
};

type AccountsListApiOptionsType = {
  ...BaseApiOptionsType,
};

type AccountsReteriveOptionsType = {
  ...BaseApiOptionsType,
  accountId: string,
};

type AccountsReteriveBalancesOptionsType = {
  ...BaseApiOptionsType,
  accountId: string,
};

type AccountsReteriveTransactionsOptionsType = {
  ...BaseApiOptionsType,
  accountId: string,
};

const shbCreator = (
  clientId: string,
  host: string = 'sandbox.handelsbanken.com',
) => {
  const _get = async (options: {}) =>
    get({
      host,
      ...options,
    });

  const _createHeaders = (headers = {}) => {
    return {
      'X-IBM-Client-Id': clientId,
      accept: 'application/json',
      ...headers,
    };
  };

  const shb = {};

  const accounts = {};

  type ListApiOptionsType = {
    ...BaseApiOptionsType,
  };
  accounts.list = async ({
    authorization,
    psuIpAddress,
    tppTransactionId,
    tppRequestId,
  }: ListApiOptionsType): Promise<Account[]> => {
    const data = await _get({
      path: '/openbanking/psd2/v1/accounts',

      headers: _createHeaders({
        Authorization: authorization,
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
  }: AccountsReteriveOptionsType): Promise<Account> => {
    const data = await _get({
      path: `/openbanking/psd2/v1/accounts/${accountId}`,

      headers: _createHeaders({
        Authorization: authorization,
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
  }: AccountsReteriveBalancesOptionsType): Promise<Balance[]> => {
    const data = await _get({
      path: `/openbanking/psd2/v1/accounts/${accountId}/balances`,

      headers: _createHeaders({
        Authorization: authorization,
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
  }: AccountsReteriveTransactionsOptionsType): Promise<Transaction[]> => {
    const data = await _get({
      path: `/openbanking/psd2/v1/accounts/${accountId}/transactions`,

      headers: _createHeaders({
        Authorization: authorization,
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
