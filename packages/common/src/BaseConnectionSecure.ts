import { BaseConnection } from "./BaseConnection";
import { BaseConnectionSecureInterface } from "./types";

export abstract class BaseConnectionSecure<TAuth>
  extends BaseConnection
  implements BaseConnectionSecureInterface<TAuth>
{
  abstract auth: TAuth;
}
