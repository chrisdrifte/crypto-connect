import { CoinbaseAccount, CoinbasePaginatedResource } from "./coinbase-types";
import { CoinbaseAPIKeys } from "./CoinbaseApiKeys";
import { CoinbaseOAuth } from "./CoinbaseOAuth";
import {
  UndocumentedResponseError,
  NotAuthorizedError,
} from "@crypto-connect/errors";
import {
  AuthMethodCredentials,
  CryptoBalance,
  BaseConnectionSecure,
} from "@crypto-connect/common";

/**
 * Array of scopes required to use this package
 */
const REQUIRED_SCOPES = ["wallet:accounts:read"];

/**
 * Coinbase API Base URL
 */
const BASE_URL = "https://api.coinbase.com";

/**
 * Coinbase Request Endpoints
 */
const ENDPOINTS = {
  permissions: `${BASE_URL}/v2/user/auth`,
  accounts: `${BASE_URL}/v2/accounts?limit=100`,
};

/**
 * Coinbase API Auth Methods
 */
type CoinbaseAuthMethods = {
  apiKeys: CoinbaseAPIKeys;
  oauth: CoinbaseOAuth;
};

/**
 * Coinbase API Client
 */
class CoinbaseConnectionSecure extends BaseConnectionSecure<CoinbaseAuthMethods> {
  // create auth method instances with context
  auth = {
    apiKeys: new CoinbaseAPIKeys(this.context),
    oauth: new CoinbaseOAuth(this.context),
  };

  // store the current auth method (whichever was last configured)
  currentAuth: CoinbaseAPIKeys | CoinbaseOAuth = this.auth.apiKeys;

  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(apiKeys: AuthMethodCredentials<CoinbaseAPIKeys>): this {
    this.auth.apiKeys.setCredentials(apiKeys);
    this.currentAuth = this.auth.apiKeys;

    return this;
  }

  /**
   * Use the `OAuth` auth method to authorize requests
   */
  withOAuth(credentials: AuthMethodCredentials<CoinbaseOAuth>): this {
    this.auth.oauth.setCredentials(credentials);
    this.currentAuth = this.auth.oauth;

    return this;
  }

  /**
   * Throw `NotAuthorizedError` if user is authenticated with invalid scopes
   */
  async throwErrorOnInvalidPermissions(): Promise<void> {
    const url = ENDPOINTS.permissions;
    const permissions = await this.currentAuth.request<{ scopes: string[] }>(
      url,
    );

    const requiredScopes = REQUIRED_SCOPES;
    const grantedScopes = permissions.scopes;

    const missingScopes = requiredScopes.filter(
      (requiredScope) => !grantedScopes.includes(requiredScope),
    );
    const extraScopes = grantedScopes.filter(
      (grantedScope) => !requiredScopes.includes(grantedScope),
    );

    if (missingScopes.length) {
      console.error(`Insufficient permissions: add ${missingScopes}`);
      throw new NotAuthorizedError();
    }

    if (extraScopes.length) {
      console.warn(`Superfluous permissions: remove ${extraScopes}`);
    }
  }

  /**
   * Request all pages for a resource and return the combined data
   */
  async getPaginatedResource<TItem>(endpoint: string | null): Promise<TItem[]> {
    let items: TItem[] = [];

    while (endpoint !== null) {
      const result = await this.currentAuth.request<
        CoinbasePaginatedResource<TItem>
      >(endpoint);

      // handle errors
      if (!result || typeof result.data === "undefined") {
        throw new UndocumentedResponseError();
      }

      // Help devs notice warnings
      // @see https://developers.coinbase.com/api/v2#warnings
      if (result.warnings) {
        console.warn(result.warnings);
      }

      // add data to list of items
      items = items.concat(result.data);

      // Loop through paginaton to fetch all results
      // @see https://developers.coinbase.com/api/v2#pagination
      if (
        typeof result.pagination === "object" &&
        typeof result.pagination.next_uri === "string"
      ) {
        endpoint = `${BASE_URL}${result.pagination.next_uri}`;
        continue;
      }

      break;
    }

    return items;
  }

  /**
   * Get raw data for Coinbase accounts
   */
  async getAccounts(): Promise<CoinbaseAccount[]> {
    const url = ENDPOINTS.accounts;
    const accounts = await this.getPaginatedResource<CoinbaseAccount>(url);

    return accounts;
  }

  /**
   * Get normalized list of Coinbase balances
   */
  async getBalances(): Promise<CryptoBalance[]> {
    const accounts = await this.getAccounts();

    const balances: CryptoBalance[] = accounts.map((account) => ({
      id: account.id,
      asset: account.balance.currency,
      amount: account.balance.amount,
    }));

    return balances as unknown as [];
  }
}

export { CoinbaseConnectionSecure as Coinbase };
