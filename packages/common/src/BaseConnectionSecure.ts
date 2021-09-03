import { AuthMethod } from "./AuthMethods/AuthMethod";
import { BaseConnection } from "./BaseConnection";
import { BaseConnectionInterface } from "./types";

/**
 * A connection to a service which implements authorization
 */
export abstract class BaseConnectionSecure<TAuth extends AuthMethod>
  extends BaseConnection
  implements BaseConnectionInterface
{
  protected abstract auth: TAuth;
}
