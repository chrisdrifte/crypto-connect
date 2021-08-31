/**
 * @see https://docs.pro.coinbase.com/#requests
 */
export type CoinbaseProRequestBody = Record<string, string> | string;

/**
 * @see https://docs.pro.coinbase.com/#errors
 */
export interface CoinbaseProError {
  message: string;
}

/**
 * @see https://docs.pro.coinbase.com/#accounts
 */
export type CoinbaseProAccount = {
  id: string;
  currency: string;
  balance: string;
  hold: string;
  available: string;
  profile_id: string;
  trading_enabled: string;
};
