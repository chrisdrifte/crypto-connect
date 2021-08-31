import { CryptoConnectError } from "./CryptoConnectError";

/**
 * Request failed: credentials not accepted
 */
export class NotAuthorizedError extends CryptoConnectError {
  constructor() {
    super("Request failed: credentials not accepted");
    this.name = "NotAuthorizedError";
  }
}
