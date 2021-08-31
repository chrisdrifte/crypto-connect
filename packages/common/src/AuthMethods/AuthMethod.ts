import {
  AuthMethodInterface,
  Credentials,
  BaseConnectionContext,
} from "../types";

export abstract class AuthMethod<
  TCredentials extends Credentials = Credentials,
  TContext extends BaseConnectionContext = BaseConnectionContext,
> implements AuthMethodInterface<TCredentials, TContext>
{
  // credentials will be available on the instance
  _credentials?: TCredentials;

  // some plugins might override this with custom logic
  // for example to validate or transform credentials
  setCredentials(credentials: TCredentials): void {
    this._credentials = credentials;
  }

  get credentials(): TCredentials | undefined {
    return this._credentials;
  }

  set credentials(credentials: TCredentials | undefined) {
    if (typeof this._credentials !== "undefined") {
      throw new Error(
        "For security reasons, do not set credentials more than once on each instance",
      );
    }

    this._credentials = credentials;
  }

  // inject context in the constructor
  constructor(public context: TContext) {}

  // we leave the request method for the package author to implement
  abstract request(...args: unknown[]): Promise<unknown>;
}
