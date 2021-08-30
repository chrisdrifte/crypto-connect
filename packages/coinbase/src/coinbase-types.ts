/**
 * @see https://developers.coinbase.com/api/v2#making-requests
 */
export type CoinbaseRequestBody = Record<string, string> | string;

/**
 * @see https://developers.coinbase.com/api/v2#errors
 */
export interface CoinbaseError {
  id: string;
  message: string;
  url?: string;
}

/**
 * @see https://developers.coinbase.com/api/v2#pagination
 */
export interface CoinbasePaginatedResource<TData = unknown>
  extends Record<string, unknown> {
  pagination: {
    ending_before: string | null;
    starting_after: string | null;
    limit: number;
    order: string;
    previous_uri: string | null;
    next_uri: string | null;
  };
  data: TData[] | { errors: CoinbaseError[] };
  warnings?: CoinbaseError[];
}

/**
 * @see https://developers.coinbase.com/api/v2#accounts
 */
export type CoinbaseAccount = {
  id: string;
  name: string;
  primary: boolean;
  type: string;
  currency: string;
  balance: { amount: string; currency: string };
  created_at: string;
  updated_at: string;
  resource: string;
  resource_path: string;
  allow_deposits: true;
  allow_withdrawals: true;
  native_balance: { amount: string; currency: string };
};
