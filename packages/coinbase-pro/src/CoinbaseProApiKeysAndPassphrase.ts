import crypto from "crypto";
import { AuthMethod, ResponseData } from "@crypto-connect/common";
import { CoinbaseProRequestBody } from "./coinbase-pro-types";

export class CoinbaseProApiKeysAndPassphrase extends AuthMethod<{
  apiKey: string;
  apiSecret: string;
  passphrase: string;
}> {
  /**
   * Convert key/value objects to query string
   */
  static serializeData(data: CoinbaseProRequestBody): string {
    // handle objects
    if (typeof data === "object") {
      return JSON.stringify(data);
    }

    // handle other types
    return data.toString();
  }

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
    data: CoinbaseProRequestBody = "",
  ): string {
    const { pathname, search } = new URL(url);

    if (typeof data !== "string") {
      throw new TypeError("data must be a string");
    }

    return `${timestamp}${method.toUpperCase()}${pathname}${search}${data}`;
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
    method: string,
    url: string,
    data: CoinbaseProRequestBody = "",
  ): Promise<TResult> {
    // check that we have config
    if (typeof this.credentials === "undefined") {
      throw new Error("You must provide credentials first");
    }

    const { requestHandler } = this.context;
    const { apiKey, apiSecret, passphrase } = this.credentials;

    const timestamp = CoinbaseProApiKeysAndPassphrase.getTimestamp();
    const message = CoinbaseProApiKeysAndPassphrase.getMessage(
      timestamp,
      method,
      url,
      data,
    );
    const signature = CoinbaseProApiKeysAndPassphrase.getSignature(
      message,
      apiSecret,
    );

    const result = await requestHandler(url, {
      headers: {
        "User-Agent": "TrueWorth",
        "CB-ACCESS-KEY": apiKey,
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": timestamp,
        "CB-ACCESS-PASSPHRASE": passphrase,
      },
    });

    return result.data as TResult;
  }
}
