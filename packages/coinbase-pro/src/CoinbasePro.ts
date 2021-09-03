import { BaseConnectionSecure, CryptoBalance } from "@crypto-connect/common";
import { CoinbaseProAccount } from "./coinbase-pro-types";
import { CoinbaseProApiKeys } from "./CoinbaseProApiKeys";
import { UndocumentedResultError } from "@crypto-connect/errors";

/**
 * Coinbase Pro API Base URL
 */
const BASE_URL = "https://api.pro.coinbase.com";

/**
 * Coinbase Pro Request Endpoints
 */
const ENDPOINTS = {
  accounts: `${BASE_URL}/accounts`,
};

/**
 * Coinbase Pro API Auth Methods
 */
type CoinbaseProAuth = CoinbaseProApiKeys;

/**
 * Coinbase Pro API Client
 */
class CoinbaseProConnectionSecure extends BaseConnectionSecure<CoinbaseProAuth> {
  /**
   * Supply auth in constructor
   */
  constructor(protected auth: CoinbaseProAuth) {
    super();
  }

  /**
   * Get raw data for Coinbase Pro accounts
   */
  async getAccounts(): Promise<CoinbaseProAccount[]> {
    const endpoint = ENDPOINTS.accounts;
    const accounts = await this.auth.request<CoinbaseProAccount[]>(endpoint);

    if (!(accounts instanceof Array)) {
      throw new UndocumentedResultError(
        endpoint,
        "CoinbaseProAccount[]",
        accounts,
      );
    }

    accounts.forEach((account) => {
      if (
        typeof account.id === "undefined" ||
        typeof account.currency === "undefined" ||
        typeof account.balance === "undefined"
      ) {
        throw new UndocumentedResultError(
          endpoint,
          "CoinbaseProAccount",
          account,
        );
      }
    });

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
