import defaultFetch from "cross-fetch";
import { RequestHandler } from "../../types";
import { serializeRequestBody } from "../../utility/serializeRequestBody";

export const crossFetchAdaptor =
  (fetch = defaultFetch): RequestHandler =>
  async (url, { method = "GET", headers = {}, body = "" } = {}) => {
    const requestHeaders = Object.assign({}, headers);

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body to applicable methods
    const canHaveBody = () => !["GET", "HEAD"].includes(method.toUpperCase());
    if (body && canHaveBody()) {
      requestHeaders["Content-Type"] = "application/x-www-form-urlencoded";
      requestInit.body = serializeRequestBody(body);
    }

    const response = await fetch(url, requestInit);

    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      status: response.status,
      headers: responseHeaders,
      data: await response.json(),
    };
  };
