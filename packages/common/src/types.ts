/**
 * Methods required by all connections
 */
export interface BaseConnectionInterface {
  getBalances(): Promise<CryptoBalance[]>;
}

/**
 * Transform clients like axios, crossFetch, got etc. into a request handler
 */
export type RequestHandlerAdaptor = (client: any) => RequestHandler;

/**
 * Normalized request handler
 */
export type RequestHandler = (
  url: RequestUrl,
  options?: RequestOptions,
) => Promise<Response>;

/**
 * Normalized request
 */
export type RequestOptions =
  | {
      method?: RequestMethod;
      headers?: RequestHeaders;
      body?: RequestBody;
    }
  | undefined;

/**
 * Normalized response
 */
export type Response<TBody extends ResponseBody = ResponseBody> = {
  status?: ResponseStatus;
  headers?: ResponseHeaders;
  body: TBody;
};

/**
 * Method of HTTP request - GET, POST, etc.
 */
export type RequestMethod = string;

/**
 * Full url of HTTP request
 */
export type RequestUrl = string;

/**
 * Headers of HTTP request
 */
export type RequestHeaders = Record<string, string>;

/**
 * Body of HTTP request
 */
export type RequestBody = Record<string, string> | string;

/**
 * Status of HTTP response
 */
export type ResponseStatus = number;

/**
 * Headers of HTTP response
 */
export type ResponseHeaders = Record<string, string | string[] | undefined>;

/**
 * Body of HTTP response
 */
export type ResponseBody = (Record<string, unknown> | unknown[]) | undefined;

/**
 * Normalized Crypto Balance
 */
export type CryptoBalance = { id: string; asset: string; amount: string };
