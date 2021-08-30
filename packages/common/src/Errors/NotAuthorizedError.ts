import { CryptoConnectError } from "./CryptoConnectError";

export class NotAuthorizedError extends CryptoConnectError {
  constructor() {
    super("Not Authorized");
    this.name = "NotAuthorizedError";
  }
}
