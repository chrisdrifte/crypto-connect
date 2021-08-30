import * as crypto from "crypto";
import { CoinbaseRequestBody } from "./coinbase-types";
import { NoCredentialsError, ServerError } from "@crypto-connect/errors";
import {
  APIKeys,
  RequestHandlerOptions,
  RequestUrl,
  ResponseData,
  serializeRequestBody,
} from "@crypto-connect/common";

/**
 * Make authenticated requests to Coinbase with Api Keys
 */
export class CoinbaseAPIKeys extends APIKeys {
  /**
   * Return current timestamp in seconds.
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
    body: CoinbaseRequestBody = "",
  ): string {
    // Method must be uppercase
    method = method.toUpperCase();

    // Url must be supplied without hostname
    const { pathname, search } = new URL(url);

    // Request body must be supplied as a string
    if (body === "object") {
      body = serializeRequestBody(body);
    }

    return `${timestamp}${method}${pathname}${search}${body}`;
  }

  /**
   * Sign message with api secret
   */
  static getSignature(message: string, apiSecret: string): string {
    return crypto.createHmac("sha256", apiSecret).update(message).digest("hex");
  }

  /**
   * Make authenticated request to Coinbase
   */
  async request<TResult extends ResponseData>(
    url: RequestUrl,
    { method = "GET", body = "" }: RequestHandlerOptions = {},
  ): Promise<TResult> {
    // Require credentials
    if (typeof this.credentials === "undefined") throw new NoCredentialsError();

    // Get request data from instance
    const { apiKey, apiSecret } = this.credentials;
    const { requestHandler } = this.context;

    // Process request data
    const timestamp = CoinbaseAPIKeys.getTimestamp();
    const message = CoinbaseAPIKeys.getMessage(timestamp, method, url, body);
    const signature = CoinbaseAPIKeys.getSignature(message, apiSecret);

    // Execute the request
    const response = await requestHandler(url, {
      headers: {
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": timestamp,
        "CB-ACCESS-KEY": apiKey,
        "CB-VERSION": "2015-07-22",
      },
    });

    // Handle non-200 status
    if (response.status !== 200) {
      console.error(response.data);
      throw new ServerError(
        response.status || 0,
        JSON.stringify(response.data),
      );
    }

    // Return payload
    return response.data as TResult;
  }
}
