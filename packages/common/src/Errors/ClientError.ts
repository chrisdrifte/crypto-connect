import { CryptoConnectError } from "./CryptoConnectError";

export class ClientError extends CryptoConnectError {
  constructor(message: string) {
    super(message);
    this.name = "ClientError";
  }
}
