import { CoinbaseProAccount } from "./coinbase-pro-types";
import { CoinbaseProApiKeys } from "./CoinbaseProApiKeys";
import {
  AuthMethodCredentials,
  Balances,
  BaseConnectionSecure,
} from "@crypto-connect/common";

const BASE_URL = "https://api.pro.coinbase.com";
const ENDPOINTS = {
  accounts: `${BASE_URL}/accounts`,
};

class CoinbaseProConnectionSecure extends BaseConnectionSecure<{
  apiKeys: CoinbaseProApiKeys;
}> {
  auth = {
    apiKeys: new CoinbaseProApiKeys(this.context),
  };

  // provide a helper to set the credentials
  useApiKeys(credentials: AuthMethodCredentials<CoinbaseProApiKeys>): this {
    this.auth.apiKeys.setCredentials(credentials);

    return this;
  }

  async getAccounts(): Promise<CoinbaseProAccount[]> {
    const url = ENDPOINTS.accounts;
    let accounts = await this.auth.apiKeys.request<CoinbaseProAccount[]>(url);

    if (!(accounts instanceof Array)) {
      accounts = [];
    }

    return accounts;
  }

  async getBalances(): Promise<Balances> {
    const accounts = await this.getAccounts();

    const balances = accounts.map((account) => ({
      id: account.id,
      asset: account.currency,
      amount: account.balance,
    }));

    return balances;
  }
}

export { CoinbaseProConnectionSecure as CoinbasePro };
