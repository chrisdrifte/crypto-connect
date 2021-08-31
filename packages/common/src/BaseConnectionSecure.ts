import { AuthMethod } from "./AuthMethods/AuthMethod";
import { BaseConnection } from "./BaseConnection";
import { BaseConnectionSecureInterface } from "./types";

/**
 * A connection to a service which implements authorization
 */
export abstract class BaseConnectionSecure<
    TAuth extends Record<string, AuthMethod>,
  >
  extends BaseConnection
  implements BaseConnectionSecureInterface<TAuth>
{
  abstract auth: TAuth;
}
