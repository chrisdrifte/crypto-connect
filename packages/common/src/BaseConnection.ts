import { BaseConnectionInterface } from "./types";

/**
 * A connection to a service which implements all normalized methods
 */
export abstract class BaseConnection implements BaseConnectionInterface {
  abstract getBalances(): ReturnType<BaseConnectionInterface["getBalances"]>;
}
