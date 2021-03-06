import * as crypto from "crypto";
import {
  ApiKeys,
  RequestUrl,
  ApiKeysCredentials,
  RequestOptions,
} from "@crypto-connect/common";

/**
 * Make authenticated requests to Coinbase with Api Keys
 */
export class CoinbaseApiKeys extends ApiKeys<ApiKeysCredentials> {
  /**
   * Return current timestamp in seconds
   * Used as nonce when signing request
   */
  static getTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Concat request options as a "message"
   * @see https://developers.coinbase.com/docs/wallet/api-key-authentication
   */
  static getMessage(
    timestamp: number,
    method: string,
    url: string,
    body = "",
  ): string {
    // Method must be uppercase
    method = method.toUpperCase();

    // Url must be supplied without hostname
    const { pathname, search } = new URL(url);

    return `${timestamp}${method}${pathname}${search}${body}`;
  }

  /**
   * Sign message with api secret
   */
  static getSignature(message: string, apiSecret: string): string {
    return crypto.createHmac("sha256", apiSecret).update(message).digest("hex");
  }

  /**
   * Sign requests to Coinbase
   */
  signRequest(url: RequestUrl): [RequestUrl, RequestOptions] {
    // Only support GET requests
    const method = "GET";
    const body = "";

    // Get request data from instance
    const { apiKey, apiSecret } = this.credentials;

    // Process request data
    const timestamp = CoinbaseApiKeys.getTimestamp();
    const message = CoinbaseApiKeys.getMessage(timestamp, method, url, body);
    const signature = CoinbaseApiKeys.getSignature(message, apiSecret);

    const headers = {
      "Content-Type": "application/json",
      "CB-ACCESS-SIGN": `${signature}`,
      "CB-ACCESS-TIMESTAMP": `${timestamp}`,
      "CB-ACCESS-KEY": `${apiKey}`,
      "CB-VERSION": "2015-07-22",
    };

    return [url, { method, headers, body }];
  }
}
