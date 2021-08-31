import { CryptoConnectError } from "./CryptoConnectError";

/**
 * Request resulted in an unexpected response.
 *
 * - API may have changed
 * - API may have undocumented behavior
 * - Code may not cover all responses
 */
export class UndocumentedResponseError extends CryptoConnectError {
  constructor() {
    super("Request resulted in an unexpected response.");
    this.name = "UndocumentedResponseError";
  }
}
