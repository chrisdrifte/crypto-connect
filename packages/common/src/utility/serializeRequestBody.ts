import { RequestBody } from "../types";
import { urlEncoded } from "./urlEncoded";

/**
 * Serialize request body to match content type
 *
 * Supports:
 * - `application/x-www-form-urlencoded`
 * - `application/json`
 */
export function serializeRequestBody(
  body: RequestBody,
  contentType = "application/x-www-form-urlencoded",
): string {
  if (typeof body === "object") {
    switch (contentType) {
      // convert to parameters
      case "application/x-www-form-urlencoded":
        return urlEncoded(body);

      // convert to JSON string
      case "application/json":
        return JSON.stringify(body);

      // fail loudly
      default:
        throw new TypeError(
          "contentType must be either `application/x-www-form-urlencoded` or `application/json`",
        );
    }
  }

  return body.toString();
}
