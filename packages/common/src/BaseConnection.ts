import { BaseConnectionContext, BaseConnectionInterface } from "./types";

export abstract class BaseConnection<TContext = BaseConnectionContext>
  implements BaseConnectionInterface
{
  abstract context: TContext;

  async checkPermissions(): Promise<void> {
    // noop by default
  }

  abstract getBalances(): ReturnType<BaseConnectionInterface["getBalances"]>;
}
