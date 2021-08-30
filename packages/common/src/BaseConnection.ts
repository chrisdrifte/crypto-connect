import { BaseConnectionContext, BaseConnectionInterface } from "./types";
import { crossFetchAdaptor } from "./adaptors/requestMethods/crossFetchAdaptor";

export abstract class BaseConnection implements BaseConnectionInterface {
  context: BaseConnectionContext = {
    requestHandler: crossFetchAdaptor(),
  };

  async checkPermissions(): Promise<void> {
    // noop by default
  }

  abstract getBalances(): ReturnType<BaseConnectionInterface["getBalances"]>;
}
