import { CoinbaseAccount, CoinbasePaginatedResource } from "./coinbase-types";
import { CoinbaseAPIKeys } from "./CoinbaseApiKeys";
import { CoinbaseOAuth } from "./CoinbaseOAuth";
import {
  AuthMethodCredentials,
  Balances,
  BaseConnectionSecure,
  BaseConnectionContext,
  ClientError,
  NotAuthorizedError,
  BadResponseError,
} from "@crypto-connect/common";

const BASE_URL = "https://api.coinbase.com";
const ENDPOINTS = {
  permissions: `${BASE_URL}/v2/user/auth`,
  accounts: `${BASE_URL}/v2/accounts?limit=100`,
};

class CoinbaseConnectionSecure extends BaseConnectionSecure<{
  apiKeys: CoinbaseAPIKeys;
  oauth: CoinbaseOAuth;
}> {
  static endpoints = ENDPOINTS;

  auth = {
    apiKeys: new CoinbaseAPIKeys(this.context),
    oauth: new CoinbaseOAuth(this.context),
  };

  // store the current auth method (whichever was last configured)
  currentAuth: CoinbaseAPIKeys | CoinbaseOAuth = this.auth.apiKeys;

  constructor(public context: BaseConnectionContext) {
    super();
  }

  // provide helpers to set the credentials
  useApiKeys(apiKeys: AuthMethodCredentials<CoinbaseAPIKeys>): this {
    this.auth.apiKeys.setCredentials(apiKeys);
    this.currentAuth = this.auth.apiKeys;

    return this;
  }

  useOAuth(credentials: AuthMethodCredentials<CoinbaseOAuth>): this {
    this.auth.oauth.setCredentials(credentials);
    this.currentAuth = this.auth.oauth;

    return this;
  }

  async checkPermissions(): Promise<void> {
    const url = CoinbaseConnectionSecure.endpoints.permissions;
    const permissions = this.currentAuth.request(url);

    // @TODO

    if (!permissions) {
      throw new NotAuthorizedError();
    }
  }

  async getPaginatedResource<TItem>(endpoint: string | null): Promise<TItem[]> {
    let items: TItem[] = [];

    while (endpoint !== null) {
      const result = await this.currentAuth.request<
        CoinbasePaginatedResource<TItem>
      >(endpoint);

      // handle errors
      if (!result || typeof result.data === "undefined") {
        throw new BadResponseError();
      }

      // Help devs notice warnings
      // @see https://developers.coinbase.com/api/v2#warnings
      if (result.warnings) {
        console.warn(result.warnings);
      }

      if (!(result.data instanceof Array)) {
        if (result.data.errors instanceof Array) {
          console.error(result.data.errors);
          throw new ClientError(result.data.errors[0].message);
        }

        throw new BadResponseError();
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

  async getAccounts(): Promise<CoinbaseAccount[]> {
    const endpoint = CoinbaseConnectionSecure.endpoints.accounts;
    const accounts = await this.getPaginatedResource<CoinbaseAccount>(endpoint);

    return accounts;
  }

  async getBalances(): Promise<Balances> {
    const accounts = await this.getAccounts();

    const balances: Balances = accounts.map((account) => ({
      id: account.id,
      asset: account.balance.currency,
      amount: account.balance.amount,
    }));

    return balances as unknown as [];
  }
}

export { CoinbaseConnectionSecure as Coinbase };
