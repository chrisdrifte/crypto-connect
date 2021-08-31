import { CryptoConnectError } from "./CryptoConnectError";

/**
 * Server responded with non-200 status
 */
export class ServerError extends CryptoConnectError {
  constructor(status: number, message: string) {
    super(`Request failed with status ${status}: ${message}`);
    this.name = "ServerError";
  }
}
