import { CryptoConnectError } from "./CryptoConnectError";

export class NoCredentialsError extends CryptoConnectError {
  constructor() {
    super(
      "A method that requires credentials was called before setCredentials()",
    );
    this.name = "NoCredentialsError";
  }
}
