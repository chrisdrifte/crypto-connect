/**
 * Package Response Types
 */
export type Balances = CryptoBalance[];

// A single crypto balance
export type CryptoBalance = { id: string; asset: string; amount: string };

/**
 * HTTP Client
 */
export type RequestMethod = string;
export type RequestUrl = string;
export type RequestHeaders = Record<string, number | string | string[]>;
export type RequestBody = Record<string, string> | string;

export type RequestHandler = (
  url: RequestUrl,
  options?: RequestHandlerOptions,
) => Promise<Response>;

export type RequestHandlerOptions =
  | {
      method?: RequestMethod;
      headers?: RequestHeaders;
      body?: RequestBody;
    }
  | undefined;
export type ResponseStatus = number;
export type ResponseHeaders = Record<string, string | string[] | undefined>;
export type ResponseData = Record<string, unknown> | unknown[];

export type Response<TData extends ResponseData = ResponseData> = {
  status?: ResponseStatus;
  headers?: ResponseHeaders;
  data: TData;
};

/**
 * Service Connections
 */
export type BaseConnectionContext = { requestHandler: RequestHandler };

// Service connections
export interface BaseConnectionInterface {
  checkPermissions(): Promise<void>;
  getBalances(): Promise<Balances>;
}

export interface BaseConnectionSecureInterface<TAuth>
  extends BaseConnectionInterface {
  auth: TAuth;
}

/**
 * Auth Methods
 */
export type Credentials = Record<string, unknown>;

export type AuthMethodCredentials<A extends AuthMethodInterface<any, any>> =
  NonNullable<A["credentials"]>;

export type AuthMethodContext<A extends AuthMethodInterface<any, any>> =
  NonNullable<A["context"]>;

export interface AuthMethodInterface<
  TCredentials extends Credentials = Credentials,
  TContext extends BaseConnectionContext = BaseConnectionContext,
> {
  context: TContext;
  credentials?: TCredentials;
  setCredentials: (credentials: TCredentials) => void;
  request: (...args: any[]) => Promise<any>;
}
