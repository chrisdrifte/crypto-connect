import { CoinbaseProAccount } from "./coinbase-pro-types";
import { CoinbaseProApiKeys } from "./CoinbaseProApiKeys";
import {
  AuthMethodCredentials,
  CryptoBalance,
  BaseConnectionSecure,
} from "@crypto-connect/common";

/**
 * Coinbase Pro API Base URL
 */
const BASE_URL = "https://api.pro.coinbase.com";

/**
 * Coinbase Request Endpoints
 */
const ENDPOINTS = {
  accounts: `${BASE_URL}/accounts`,
};

/**
 * Coinbase API Auth Methods
 */
type CoinbaseProAuthMethods = {
  apiKeys: CoinbaseProApiKeys;
};

/**
 * Coinbase Pro API Client
 */
class CoinbaseProConnectionSecure extends BaseConnectionSecure<CoinbaseProAuthMethods> {
  // create auth method instances with context
  auth = {
    apiKeys: new CoinbaseProApiKeys(this.context),
  };
  
  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(credentials: AuthMethodCredentials<CoinbaseProApiKeys>): this {
    this.auth.apiKeys.setCredentials(credentials);

    return this;
  }

  /**
   * Get raw data for Coinbase Pro accounts
   */
  async getAccounts(): Promise<CoinbaseProAccount[]> {
    const url = ENDPOINTS.accounts;
    let accounts = await this.auth.apiKeys.request<CoinbaseProAccount[]>(url);

    if (!(accounts instanceof Array)) {
      accounts = [];
    }

    return accounts;
  }

  /**
   * Get normalized list of Coinbase Pro balances
   */
  async getBalances(): Promise<CryptoBalance[]> {
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
