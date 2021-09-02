/**
 * @see
 */
export type BinanceRequestBody = Record<string, string> | string;

/**
 * @see
 */
export type BinanceResponseBody = Record<string, unknown>;

/**
 * @see https://binance-docs.github.io/apidocs/spot/en/#error-codes
 */
export interface BinanceError {
  code: number;
  msg: "Invalid Symbol";
}

/**
 * @see https://binance-docs.github.io/apidocs/spot/en/#get-api-key-permission-user_data
 */
export interface BinancePermissions {
  [key: string]: unknown;
  ipRestrict: boolean;
  createTime: number;
  enableWithdrawals: boolean;
  enableInternalTransfer: boolean;
  permitsUniversalTransfer: boolean;
  enableVanillaOptions: boolean;
  enableReading: boolean;
  enableFutures: boolean;
  enableMargin: boolean;
  enableSpotAndMarginTrading: boolean;
  tradingAuthorityExpirationTime: number;
}

/**
 * @see https://binance-docs.github.io/apidocs/spot/en/#all-coins-39-information-user_data
 */
export interface BinanceCoinInfo {
  coin: string;
  free: string;
  locked: string;
}
