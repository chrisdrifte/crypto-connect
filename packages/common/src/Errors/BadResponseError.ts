import { CryptoConnectError } from "./CryptoConnectError";

export class BadResponseError extends CryptoConnectError {
  constructor() {
    super("Bad Response");
    this.name = "BadResponseError";
  }
}
