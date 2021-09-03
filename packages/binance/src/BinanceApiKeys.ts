import * as crypto from "crypto";
import { ApiKeys, RequestOptions, RequestUrl } from "@crypto-connect/common";

/**
 * Make authenticated requests to Binance with Api Keys
 */
export class BinanceApiKeys extends ApiKeys<{
  apiKey: string;
  apiSecret: string;
}> {
  /**
   * Return current timestamp in seconds
   * Used as nonce when signing request
   */
  static getTimestamp(): number {
    return Date.now();
  }

  /**
   * Sign message with api secret
   */
  static getSignature(queryString: string, apiSecret: string): string {
    const queryStringNoQuestionMark = queryString.slice(1);

    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(queryStringNoQuestionMark)
      .digest("hex");

    return signature;
  }

  /**
   * Sign requests to Binance
   */
  signRequest(url: RequestUrl): [RequestUrl, RequestOptions] {
    // Only support GET requests
    const method = "GET";
    const body = "";

    // Get request data from instance
    const { apiKey, apiSecret } = this.credentials;

    // Create request url
    const urlObject = new URL(url);

    // Add timestamp
    const timestamp = BinanceApiKeys.getTimestamp();
    urlObject.searchParams.append("timestamp", `${timestamp}`);

    // get path
    const queryString = urlObject.search;

    // Add signature
    const signature = BinanceApiKeys.getSignature(queryString, apiSecret);
    urlObject.searchParams.append("signature", signature);

    // Supply headers
    const headers = {
      "User-Agent": "CryptoConnect",
      "Content-Type": "application/json",
      "X-MBX-APIKEY": apiKey,
    };

    return [urlObject.toString(), { method, headers, body }];
  }
}
