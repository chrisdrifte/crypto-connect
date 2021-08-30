import { CoinbaseProAccount } from "./coinbase-pro-types";
import { CoinbaseProApiKeysAndPassphrase } from "./CoinbaseProApiKeysAndPassphrase";
import {
  AuthMethodCredentials,
  Balances,
  BaseConnectionContext,
  BaseConnectionSecure,
} from "@crypto-connect/common";

const BASE_URL = "https://api.pro.coinbase.com";

class CoinbaseProConnectionSecure extends BaseConnectionSecure<{
  apiKeys: CoinbaseProApiKeysAndPassphrase;
}> {
  endpoints = {
    accounts: `${BASE_URL}/accounts`,
  };

  auth = {
    apiKeys: new CoinbaseProApiKeysAndPassphrase(this.context),
  };

  constructor(public context: BaseConnectionContext) {
    super();
  }

  // provide a helper to set the credentials
  useApiKeysAndPassphrase(
    credentials: AuthMethodCredentials<CoinbaseProApiKeysAndPassphrase>,
  ): this {
    this.auth.apiKeys.setCredentials(credentials);

    return this;
  }

  async getAccounts(): Promise<CoinbaseProAccount[]> {
    let accounts = await this.auth.apiKeys.request<CoinbaseProAccount[]>(
      "GET",
      this.endpoints.accounts,
    );

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
