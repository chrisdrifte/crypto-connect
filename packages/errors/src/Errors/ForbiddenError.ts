import { CryptoConnectError } from "./CryptoConnectError";

/**
 * Request failed: credentials accepted, but access forbidden
 */
export class ForbiddenError extends CryptoConnectError {
  constructor() {
    super("Request failed: credentials accepted, but access forbidden");
    this.name = "ForbiddenError";
  }
}
