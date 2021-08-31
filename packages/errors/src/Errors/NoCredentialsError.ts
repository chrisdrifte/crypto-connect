import { CryptoConnectError } from "./CryptoConnectError";

/**
 * Request failed: credentials not provided
 */
export class NoCredentialsError extends CryptoConnectError {
  constructor() {
    super("Request failed: credentials not provided");
    this.name = "NoCredentialsError";
  }
}
