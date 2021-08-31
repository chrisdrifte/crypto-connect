import crossFetch from "cross-fetch";
import { BaseConnectionInterface } from "./types";
import { crossFetchAdaptor } from "./adaptors/requestHandlers/crossFetchAdaptor";

/**
 * A connection to a service which implements all normalized methods
 */
export abstract class BaseConnection implements BaseConnectionInterface {
  // default context is provided
  context = {
    requestHandler: crossFetchAdaptor(crossFetch),
  };

  abstract getBalances(): ReturnType<BaseConnectionInterface["getBalances"]>;
}
