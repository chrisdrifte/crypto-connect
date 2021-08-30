import { BaseConnection } from "./BaseConnection";
import { BaseConnectionContext, BaseConnectionSecureInterface } from "./types";

export abstract class BaseConnectionSecure<
    TAuth,
    TContext = BaseConnectionContext,
  >
  extends BaseConnection<TContext>
  implements BaseConnectionSecureInterface<TAuth>
{
  abstract auth: TAuth;
}
