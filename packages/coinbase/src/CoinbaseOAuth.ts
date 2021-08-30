import { OAuth } from "@crypto-connect/common";

export class CoinbaseOAuth extends OAuth {
  // so easy to use oauth =)
  endpoints = {
    authorizeUrl: "https://www.coinbase.com/oauth/authorize",
    tokenUrl: "https://api.coinbase.com/oauth/token",
  };
}
