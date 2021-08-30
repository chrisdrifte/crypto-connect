import { RequestBody } from "../types";

export function serializeRequestBody(body: RequestBody): string {
  if (typeof body === "object") {
    const params = new URLSearchParams();
    Object.keys(body).forEach((key) => params.append(key, `${body[key]}`));

    return params.toString();
  }

  return `${body}`;
}
