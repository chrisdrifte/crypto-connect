import { BaseConnectionContext } from "../types";

/**
 * Properties required by all auth methods
 */
export interface AuthMethodInterface<
  TCredentials extends BaseCredentials = BaseCredentials,
  TContext extends BaseConnectionContext = BaseConnectionContext,
> {
  context: TContext;
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
export type AuthMethodCredentials<A extends AuthMethodInterface<any, any>> =
  NonNullable<A["credentials"]>;

/**
 * Helper to get context from an auth method
 */
export type AuthMethodContext<A extends AuthMethodInterface<any, any>> =
  NonNullable<A["context"]>;

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
  TContext extends BaseConnectionContext = BaseConnectionContext,
> implements AuthMethodInterface<TCredentials, TContext>
{
  /**
   * Privately stored credentials
   *
   * **DO NOT ACCESS DIRECTLY**
   */
  _credentials?: TCredentials;

  /**
   * Private credentials getter
   */
  get credentials(): TCredentials | undefined {
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
  setCredentials(credentials: TCredentials): void {
    this._credentials = credentials;
  }

  /**
   * Constructor
   *
   * Make context available on instances
   */
  constructor(public context: TContext) {}

  /**
   * Abstract request method, to be implemented by child class
   */
  abstract request(...args: unknown[]): Promise<unknown>;
}
