/**
 * @see https://docs.kraken.com/rest/#section/General-Usage/Requests-Responses-and-Errors
 */
export type KrakenRequestBody = Record<string, string> | string;

/**
 * @see https://docs.kraken.com/rest/#section/General-Usage/Requests-Responses-and-Errors
 */
export interface KrakenResponseBody<TResult> {
  [key: string]: unknown;
  error: string[];
  result: TResult;
}

/**
 * @see https://docs.kraken.com/rest/#section/General-Usage/Requests-Responses-and-Errors
 */
export interface KrakenError {
  error: string[];
}

/**
 * @see https://docs.kraken.com/rest/#tag/User-Data
 */
export type KrakenAccount = Record<string, string>;
