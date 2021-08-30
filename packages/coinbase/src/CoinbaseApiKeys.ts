import * as crypto from "crypto";
import { CoinbaseRequestBody } from "./coinbase-types";
import {
  APIKeys,
  NoCredentialsError,
  RequestHandlerOptions,
  RequestUrl,
  ResponseData,
  ServerError,
} from "@crypto-connect/common";

export class CoinbaseAPIKeys extends APIKeys {
  /**
   * Convert key/value objects to query string
   */
  static serializeData(data: CoinbaseRequestBody): string {
    // handle objects
    if (typeof data === "object") {
      return new URLSearchParams(data).toString();
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
   * @see https://developers.coinbase.com/docs/wallet/api-key-authentication
   */
  static getMessage(
    timestamp: number,
    method: string,
    url: string,
    data: CoinbaseRequestBody = "",
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
    return crypto.createHmac("sha256", apiSecret).update(message).digest("hex");
  }

  async request<TResult extends ResponseData>(
    url: RequestUrl,
    { method = "GET" }: RequestHandlerOptions = {},
  ): Promise<TResult> {
    if (typeof this.credentials === "undefined") throw new NoCredentialsError();

    const { apiKey, apiSecret } = this.credentials;
    const { requestHandler } = this.context;

    const timestamp = CoinbaseAPIKeys.getTimestamp();
    const message = CoinbaseAPIKeys.getMessage(timestamp, method, url, "");
    const signature = CoinbaseAPIKeys.getSignature(message, apiSecret);

    const response = await requestHandler(url, {
      headers: {
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": timestamp,
        "CB-ACCESS-KEY": apiKey,
        "CB-VERSION": "2015-07-22",
      },
    });

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
