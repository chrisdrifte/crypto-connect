import * as crypto from "crypto";
import { KrakenError } from "./kraken-types";
import {
  ApiKeys,
  RequestOptions,
  RequestUrl,
  urlEncoded,
} from "@crypto-connect/common";

/**
 * Make authenticated requests to Kraken with Api Keys
 */
export class KrakenApiKeys extends ApiKeys<
  {
    apiKey: string;
    apiSecret: string;
  },
  KrakenError
> {
  /**
   * Return current timestamp in seconds
   * Used as nonce when signing request
   */
  static getNonce(): string {
    return `${Math.floor(Date.now() / 1000)}`;
  }

  /**
   * Sign message with api secret
   */
  static getSignature(
    path: string,
    request: Record<string, string>,
    secret: string,
  ): string {
    const message = urlEncoded(request);
    const secret_buffer = Buffer.from(secret, "base64");

    const hash_digest = crypto
      .createHash("sha256")
      .update(request.nonce + message)
      .digest()
      .toString("latin1");

    const hmac_digest = crypto
      .createHmac("sha512", secret_buffer)
      .update(path + hash_digest, "binary")
      .digest("base64");

    return hmac_digest;
  }

  /**
   * Sign requests to Coinbase
   */
  signRequest(url: RequestUrl): [RequestUrl, RequestOptions] {
    // Only support POST requests
    const method = "POST";
    const body: Record<string, string> = {};

    // Get path from url
    const { pathname, search } = new URL(url);
    const path = `${pathname}${search}`;

    // Get request data from instance
    const { apiKey, apiSecret } = this.credentials;

    // Process request data
    body.nonce = KrakenApiKeys.getNonce();
    const apiSign = KrakenApiKeys.getSignature(path, body, apiSecret);

    const headers = {
      "User-Agent": "CryptoConnect",
      "Content-Type": "application/x-www-form-urlencoded",
      "API-Key": `${apiKey}`,
      "API-Sign": `${apiSign}`,
    };

    return [url, { method, headers, body }];
  }
}
