/**
 * Transform an object to query string appropriate for
 * `application/x-www-form-urlencoded` data
 */
export function urlEncoded(body: Record<string, string>): string {
  const params = new URLSearchParams();
  Object.keys(body).forEach((key) => params.append(key, `${body[key]}`));

  return params.toString();
}
