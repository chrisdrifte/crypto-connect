import crypto from "crypto";
import { AuthMethod, RequestUrl, ResponseData } from "@crypto-connect/common";
import { NoCredentialsError, ServerError } from "@crypto-connect/errors";

export class CoinbaseProApiKeys extends AuthMethod<{
  apiKey: string;
  apiSecret: string;
  passphrase: string;
}> {
  /**
   * Return current timestamp in seconds
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
   * Handle a request
   */
  async request<TResult extends ResponseData>(
    url: RequestUrl,
  ): Promise<TResult> {
    if (typeof this.credentials === "undefined") throw new NoCredentialsError();

    const { requestHandler } = this.context;
    const { apiKey, apiSecret, passphrase } = this.credentials;

    const timestamp = CoinbaseProApiKeys.getTimestamp();
    const message = CoinbaseProApiKeys.getMessage(timestamp, "GET", url);
    const signature = CoinbaseProApiKeys.getSignature(message, apiSecret);

    const headers = {
      "User-Agent": "CryptoConnect",
      "CB-ACCESS-KEY": `${apiKey}`,
      "CB-ACCESS-SIGN": `${signature}`,
      "CB-ACCESS-TIMESTAMP": `${timestamp}`,
      "CB-ACCESS-PASSPHRASE": `${passphrase}`,
    };

    const response = await requestHandler(url, {
      headers,
    });

    // Handle non-200 status
    if (response.status !== 200) {
      console.error(response.data);
      throw new ServerError(
        response.status || 0,
        JSON.stringify(response.data),
      );
    }

    return response.data as TResult;
  }
}
