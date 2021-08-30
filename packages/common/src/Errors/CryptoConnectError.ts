export class CryptoConnectError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CryptoConnectError";
  }
}
