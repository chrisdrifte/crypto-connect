export type CoinbaseProRequestBody = Record<string, string> | string;

export type CoinbaseProAccount = {
  id: string;
  currency: string;
  balance: string;
  hold: string;
  available: string;
  profile_id: string;
  trading_enabled: string;
};
