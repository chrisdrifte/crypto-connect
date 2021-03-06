# CryptoConnect Common Files

This package is primarily aimed at providing most of the boilerplate needed
to build integrations.

In general, it's expected for integrations to be created by extending
`BaseConnectionSecure` with a custom or existing auth method.

# Implementing Custom Connections

```ts
import { BaseConnectionSecure, CryptoBalance } from "@crypto-connect/common";
import { ExampleApiKeys } from "./ExampleApiKeys";
import { ExampleBalances } from "./example-types";

/**
 * Example API Base URL
 */
const BASE_URL = "https://api.example.com";

/**
 * Example Request Endpoints
 */
const ENDPOINTS = {
  balances: `${BASE_URL}/balances`,
};

/**
 * Example Auth Methods
 */
type ExampleAuth = ExampleApiKeys;

/**
 * Example API Client
 */
class ExampleConnectionSecure extends BaseConnectionSecure<ExampleAuth> {
  /**
   * Supply auth in constructor
   */
  constructor(protected auth: ExampleAuth) {
    super();
  }

  /**
   * Get normalized list of Example balances
   */
  async getBalances(): Promise<CryptoBalance[]> {
    const endpoint = ENDPOINTS.accounts;
    const result = await this.auth.request<ExampleBalances>(endpoint);

    // convert api result to balances
    // ...

    return balances;
  }
}

export { ExampleConnectionSecure as Example };
```

## Implementing Custom Auth Methods

### OAuth

Integrating a service that uses OAuth is very simple - define the endpoints and
the error type.

```ts
import { OAuth } from "@crypto-connect/common";

/**
 * Example OAuth Base URL
 */
const BASE_URL = "https://api.example.com";

/**
 * Example OAuth Endpoints
 */
const ENDPOINTS = {
  authorizeUrl: `${BASE_URL}/oauth/authorize`,
  tokenUrl: `${BASE_URL}/oauth/token`,
};

/**
 * Service Error Response
 */
type ExampleError = { error: string };

/**
 * Make authenticated requests with OAuth
 */
export class ExampleOAuth extends OAuth<ExampleError> {
  endpoints = ENDPOINTS;
}
```

### API Keys

Services that use API keys are varied in their approach, so require more effort.
A `signRequest` method must be defined that takes the request parameters and
credentials, and returns signed request parameters as needed.

```ts
import { ApiKeys, RequestUrl, RequestOptions } from "@crypto-connect/common";

/**
 * Make authenticated requests with Api Keys
 */
export class ExampleAPIKeys extends ApiKeys<
  // service credentials
  {
    apiKey: string;
    apiSecret: string;
  },
  // service error response
  {
    error: string;
  }
> {
  /**
   * Sign requests
   */
  signRequest(
    url: RequestUrl,
    { method = "GET", headers = {}, body = "" }: RequestOptions = {},
  ): [RequestUrl, RequestOptions] {
    const { apiKey, apiSecret } = this.credentials;

    // Generate a signature and sign the request
    // ...

    return [url, { method, headers, body }];
  }
}
```
