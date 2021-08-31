/**
 * Normalized Crypto Balance
 */
export type CryptoBalance = { id: string; asset: string; amount: string };

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
export type ResponseBody = Record<string, unknown> | unknown[];

/**
 * Normalized request
 */
export type Request =
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
 * Transform clients like axios, crossFetch, got etc. into a request handler
 */
export type RequestHandlerAdaptor = (client: any) => RequestHandler;

/**
 * Normalized request handler
 */
export type RequestHandler = (
  url: RequestUrl,
  options?: Request,
) => Promise<Response>;

/**
 * Context required by all connections
 */
export type BaseConnectionContext = { requestHandler: RequestHandler };

/**
 * Methods required by all connections
 */
export interface BaseConnectionInterface {
  getBalances(): Promise<CryptoBalance[]>;
}

/**
 * Methods required by all connections that implement authorization
 */
export interface BaseConnectionSecureInterface<TAuth>
  extends BaseConnectionInterface {
  auth: TAuth;
}
