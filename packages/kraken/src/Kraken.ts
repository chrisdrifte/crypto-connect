import { KrakenApiKeys } from "./KrakenApiKeys";
import { ServerError } from "@crypto-connect/errors/src";
import { UndocumentedResultError } from "@crypto-connect/errors/src";
import {
  KrakenAccounts,
  KrakenError,
  KrakenResponseBody,
} from "./kraken-types";
import {
  AuthMethodCredentials,
  CryptoBalance,
  BaseConnectionSecure,
} from "@crypto-connect/common";

/**
 * Kraken API Base URL
 */
const BASE_URL = "https://api.kraken.com";

/**
 * Kraken Request Endpoints
 */
const ENDPOINTS = {
  accounts: `${BASE_URL}/0/private/Balance`,
};

/**
 * Kraken Auth Methods
 */
type KrakenAuthMethods = {
  apiKeys: KrakenApiKeys;
};

/**
 * Kraken API Client
 */
class KrakenConnectionSecure extends BaseConnectionSecure<KrakenAuthMethods> {
  // create auth method instances with context
  auth = {
    apiKeys: new KrakenApiKeys(this.context),
  };

  /**
   * Handle error responses
   */
  static throwIfErrorResult(result: KrakenError): void {
    if (result.error instanceof Array && result.error.length) {
      throw new ServerError(200, result.error.join(", "));
    }
  }

  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(credentials: AuthMethodCredentials<KrakenApiKeys>): this {
    this.auth.apiKeys.setCredentials(credentials);

    return this;
  }

  /**
   * Get raw data for Kraken accounts
   */
  async getAccounts(): Promise<KrakenAccounts> {
    const endpoint = ENDPOINTS.accounts;
    const result = await this.auth.apiKeys.request<
      KrakenResponseBody<KrakenAccounts>
    >(endpoint);

    KrakenConnectionSecure.throwIfErrorResult(result);

    const accounts = result.result;

    if (typeof accounts !== "object") {
      throw new UndocumentedResultError(
        endpoint,
        "KrakenResponseBody<KrakenAccount>",
        accounts,
      );
    }

    return accounts;
  }

  /**
   * Get normalized list of Kraken balances
   */
  async getBalances(): Promise<CryptoBalance[]> {
    const accounts = await this.getAccounts();
    const balances: CryptoBalance[] = [];

    Object.keys(accounts).forEach((asset) => {
      const amount = accounts[asset];
      balances.push({
        id: `kraken-${asset}`,
        asset,
        amount,
      });
    });

    return balances;
  }
}

export { KrakenConnectionSecure as Kraken };
