import { RequestHandlerAdaptor } from "../../types";
import { serializeRequestBody } from "../../utility/serializeRequestBody";

/**
 * Adapt crossFetch into a request handler
 *
 * @example
 *
 * ```ts
 * import crossFetch from "crossFetch"
 * const requestHandler = crossFetchAdaptor(crossFetch);
 * ```
 */
export const crossFetchAdaptor: RequestHandlerAdaptor =
  (fetch) =>
  async (url, { method = "GET", headers = {}, body = "" } = {}) => {
    const requestHeaders = Object.assign({}, headers);

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body to applicable methods
    const canHaveBody = () => !["GET", "HEAD"].includes(method.toUpperCase());
    if (body && canHaveBody()) {
      requestInit.body = serializeRequestBody(
        body,
        requestHeaders["Content-Type"],
      );
    }

    const response = await fetch(url, requestInit);

    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const responseBody = await response.json();

    return {
      status: response.status,
      headers: responseHeaders,
      body: responseBody,
    };
  };
