import { RequestBody } from "../types";

const urlEncoded = (body: Record<string, string>): string => {
  const params = new URLSearchParams();
  Object.keys(body).forEach((key) => params.append(key, `${body[key]}`));

  return params.toString();
};

export function serializeRequestBody(
  body: RequestBody,
  contentType = "application/x-www-form-urlencoded",
): string {
  if (typeof body === "object") {
    switch (contentType) {
      case "application/x-www-form-urlencoded":
        return urlEncoded(body);

      case "application/json":
        return JSON.stringify(body);

      default:
        throw new TypeError(
          "contentType must be either application/x-www-form-urlencoded or application/json",
        );
    }
  }

  return body.toString();
}
