import crossFetch from "cross-fetch";
import { crossFetchAdaptor } from "../adaptors/requestHandlers/crossFetchAdaptor";
import { NoCredentialsError } from "@crypto-connect/errors";
import { RequestHandler } from "../types";

/**
 * Context required by all auth methods
 */
export type AuthMethodContext = { requestHandler: RequestHandler };

/**
 * Properties required by all auth methods
 */
export interface AuthMethodInterface<
  TCredentials extends BaseCredentials = BaseCredentials,
> {
  context: AuthMethodContext;
  credentials?: TCredentials;
  setCredentials: (credentials: TCredentials) => void;
  request: (...args: any[]) => Promise<any>;
}

/**
 * Credentials used for authorization
 */
export type BaseCredentials = Record<string, unknown>;

/**
 * Helper to get credentials from an auth method
 */
export type AuthMethodCredentials<A extends AuthMethodInterface<any>> =
  NonNullable<A["credentials"]>;

/**
 * Abstract class for auth methods
 *
 * Implements:
 * - Types for credentials
 * - Handling of credentials
 * - Types for context
 * - Injection of context via constructor
 */
export abstract class AuthMethod<
  TCredentials extends BaseCredentials = BaseCredentials,
> implements AuthMethodInterface<TCredentials>
{
  /**
   * Context for requests
   */
  context = {
    requestHandler: crossFetchAdaptor(crossFetch),
  };

  /**
   * Privately stored credentials
   *
   * **DO NOT ACCESS DIRECTLY**
   */
  _credentials?: TCredentials;

  /**
   * Private credentials getter
   */
  get credentials(): TCredentials {
    if (typeof this._credentials === "undefined") {
      throw new NoCredentialsError();
    }

    return this._credentials;
  }

  /**
   * Private credentials setter
   *
   * Prevents credentials from being set more than once.
   */
  set credentials(credentials: TCredentials | undefined) {
    if (typeof this._credentials !== "undefined") {
      throw new Error(
        "For security reasons, do not set credentials more than once on each instance",
      );
    }

    this._credentials = credentials;
  }

  /**
   * Public credentials setter
   *
   * Override if custom validation/transformation needed.
   */
  setCredentials(credentials: TCredentials): this {
    this.credentials = credentials;

    return this;
  }

  /**
   * Abstract request method, to be implemented by child class
   */
  abstract request(...args: unknown[]): Promise<unknown>;
}
