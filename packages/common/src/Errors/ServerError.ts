import { CryptoConnectError } from "./CryptoConnectError";

export class ServerError extends CryptoConnectError {
  constructor(status: number, message: string) {
    super(`${status}: ${message}`);
    this.name = "ServerError";
  }
}
