import { CryptoConnectError } from "./CryptoConnectError";

/**
 * Request resulted in an unexpected response.
 *
 * - API may have changed
 * - API may have undocumented behavior
 * - Code may not cover all responses
 */
export class UndocumentedResultError extends CryptoConnectError {
  constructor(endpoint: string, expectedType: string, response: unknown) {
    super(
      `${endpoint} expected ${expectedType} but got ${JSON.stringify(
        response,
      )}`,
    );
    this.name = "UndocumentedResultError";
  }
}
