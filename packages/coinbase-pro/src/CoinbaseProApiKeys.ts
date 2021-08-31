import crypto from "crypto";
import { AuthMethod, RequestUrl, ResponseBody } from "@crypto-connect/common";
import { NoCredentialsError, ServerError } from "@crypto-connect/errors";

/**
 * Make authenticated requests to Coinbase Pro with Api Keys
 */
export class CoinbaseProApiKeys extends AuthMethod<{
  apiKey: string;
  apiSecret: string;
  passphrase: string;
}> {
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
   * Make authenticated request to Coinbase Pro
   */
  async request<TResult extends ResponseBody>(
    url: RequestUrl,
  ): Promise<TResult> {
    // Require credentials
    if (typeof this.credentials === "undefined") throw new NoCredentialsError();

    // Get request data from instance
    const { apiKey, apiSecret, passphrase } = this.credentials;
    const { requestHandler } = this.context;

    // Process request data
    const timestamp = CoinbaseProApiKeys.getTimestamp();
    const message = CoinbaseProApiKeys.getMessage(timestamp, "GET", url);
    const signature = CoinbaseProApiKeys.getSignature(message, apiSecret);

    const headers = {
      "User-Agent": "CryptoConnect",
      "Content-Type": "application/json",
      "CB-ACCESS-KEY": `${apiKey}`,
      "CB-ACCESS-SIGN": `${signature}`,
      "CB-ACCESS-TIMESTAMP": `${timestamp}`,
      "CB-ACCESS-PASSPHRASE": `${passphrase}`,
    };

    // Execute the request
    const response = await requestHandler(url, {
      headers,
    });

    // Handle non-200 status
    if (response.status !== 200) {
      console.error(response.body);
      throw new ServerError(
        response.status || 0,
        JSON.stringify(response.body),
      );
    }

    // Return payload
    return response.body as TResult;
  }
}
