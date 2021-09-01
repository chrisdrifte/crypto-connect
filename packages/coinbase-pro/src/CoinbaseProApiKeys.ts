import * as crypto from "crypto";
import { ApiKeys, RequestOptions, RequestUrl } from "@crypto-connect/common";
import { CoinbaseProError } from "./coinbase-pro-types";

/**
 * Make authenticated requests to Coinbase Pro with Api Keys
 */
export class CoinbaseProApiKeys extends ApiKeys<
  {
    apiKey: string;
    apiSecret: string;
    passphrase: string;
  },
  CoinbaseProError
> {
  /**
   * Return current timestamp in seconds
   * Used as nonce when signing request
   */
  static getTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Concat request options as a "message"
   * @see https://docs.pro.coinbase.com/#signing-a-message
   */
  static getMessage(
    timestamp: number,
    method: string,
    url: string,
    body = "",
  ): string {
    method = method.toUpperCase();

    const { pathname, search } = new URL(url);

    return `${timestamp}${method.toUpperCase()}${pathname}${search}${body}`;
  }

  /**
   * Sign message with api secret
   */
  static getSignature(message: string, apiSecret: string): string {
    const key = Buffer.from(apiSecret, "base64");
    return crypto.createHmac("sha256", key).update(message).digest("base64");
  }

  /**
   * Sign requests to Coinbase
   */
  signRequest(url: RequestUrl): [RequestUrl, RequestOptions] {
    // Only support GET requests
    const method = "GET";
    const body = "";

    // Get request data from instance
    const { apiKey, apiSecret, passphrase } = this.credentials;

    // Process request data
    const timestamp = CoinbaseProApiKeys.getTimestamp();
    const message = CoinbaseProApiKeys.getMessage(timestamp, method, url);
    const signature = CoinbaseProApiKeys.getSignature(message, apiSecret);

    const headers = {
      "User-Agent": "CryptoConnect",
      "Content-Type": "application/json",
      "CB-ACCESS-KEY": `${apiKey}`,
      "CB-ACCESS-SIGN": `${signature}`,
      "CB-ACCESS-TIMESTAMP": `${timestamp}`,
      "CB-ACCESS-PASSPHRASE": `${passphrase}`,
    };

    return [url, { method, headers, body }];
  }
}
