import { AuthMethod, BaseCredentials } from "../AuthMethod";
import { NotAuthorizedError } from "@crypto-connect/errors";
import {
  RequestOptions,
  RequestHeaders,
  RequestUrl,
  ResponseBody,
  RequestBody,
} from "../../types";

/**
 * Credentials and methods required to configure OAuth requests
 */
interface OAuthCredentials extends BaseCredentials {
  clientId: string;
  clientSecret: string;
  getTokensHandler: () => Promise<OAuthTokens> | OAuthTokens;
  setTokensHandler: (tokens: OAuthTokens) => Promise<void> | void;
}

/**
 * Endpoints required to make OAuth requests
 */
interface OAuthEndpoints {
  authorizeUrl: string;
  tokenUrl: string;
  revokeUrl?: string;
}

/**
 * OAuth Tokens
 */
interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Interface for OAuth auth method
 */
interface OAuthInterface extends AuthMethod<OAuthCredentials> {
  endpoints: OAuthEndpoints;
  signIn(redirectUri: string, scope?: string[], state?: string): string;
  exchangeCode(
    redirectUri: string,
    code: string,
    headers?: RequestHeaders,
  ): Promise<void>;
  exchangeRefreshToken(): Promise<void>;
}

/**
 * Authorized requests with OAuth
 */
export abstract class OAuth<TError = RequestBody>
  extends AuthMethod<OAuthCredentials>
  implements OAuthInterface
{
  /**
   * Endpoints placeholder
   */
  abstract endpoints: OAuthEndpoints;

  /**
   * Generates url for user to authorize OAuth access
   */
  signIn(redirectUri: string, scope?: string[], state?: string): string {
    redirectUri;
    scope;
    state;
    throw new Error("Not implemented");
  }

  /**
   * Exchanges code for tokens
   */
  async exchangeCode(
    redirectUri: string,
    code: string,
    headers: RequestHeaders = {},
  ): Promise<void> {
    // Get request data from instance
    const { tokenUrl } = this.endpoints;
    const { clientId, clientSecret, setTokensHandler } = this.credentials;
    const { requestHandler } = this.context;

    // Execute the request
    const response = await requestHandler(tokenUrl, {
      method: "POST",
      body: {
        grant_type: "authorization_code",
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: encodeURI(redirectUri),
      },
      headers,
    });

    // save the tokens
    const { access_token, refresh_token } = response.body as unknown as {
      access_token: string; // New active access token
      token_type: string; // Value bearer
      expires_in: string | number; // Access token expiration in seconds
      refresh_token: string; // Refresh token which can be used to refresh expired access token
      scope: string | string[]; // List of permissions applied to given access token
    };

    await setTokensHandler({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
  }

  /**
   * Exchanges refresh token for new tokens
   */
  async exchangeRefreshToken(headers: RequestHeaders = {}): Promise<void> {
    // Get request data from instance
    const { tokenUrl } = this.endpoints;
    const { clientId, clientSecret, setTokensHandler, getTokensHandler } =
      this.credentials;
    const { refreshToken } = await getTokensHandler();
    const { requestHandler } = this.context;

    // Execute the request
    const response = await requestHandler(tokenUrl, {
      method: "POST",
      body: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      },
      headers,
    });

    // save the tokens
    const { access_token, refresh_token } = response.body as unknown as {
      access_token: string; // New active access token
      token_type: string; // Value bearer
      expires_in: string | number; // Access token expiration in seconds
      refresh_token: string; // Refresh token which can be used to refresh expired access token
      scope: string | string[]; // List of permissions applied to given access token
    };

    await setTokensHandler({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
  }

  /**
   * Revoke authorization if possible
   */
  async revoke(headers: RequestHeaders = {}): Promise<void> {
    // Get request data from instance
    const { revokeUrl } = this.endpoints;

    // Ignore if optional endpoint not provided
    if (!revokeUrl) {
      return;
    }

    // Get request data from instance
    const { getTokensHandler, setTokensHandler } = this.credentials;
    const { accessToken } = await getTokensHandler();
    const { requestHandler } = this.context;

    await requestHandler(revokeUrl, {
      method: "POST",
      body: {
        token: accessToken,
      },
      headers,
    });

    await setTokensHandler({
      accessToken: "",
      refreshToken: "",
    });
  }

  /**
   * Make request to API authorized by OAuth access token
   * Automatically refresh if necessary
   */
  async request<TResult extends ResponseBody>(
    url: RequestUrl,
    { method = "GET", headers = {}, body = "" }: RequestOptions = {},
  ): Promise<TResult> {
    const { accessToken } = await this.credentials.getTokensHandler();

    // check that we have config
    if (typeof accessToken === "undefined") {
      throw new NotAuthorizedError();
    }

    // code to make request, eg:
    //
    // return await axios({ method, url })

    // if the token has expired, refresh and try again
    await this.exchangeRefreshToken();
    await this.request(url, { method, headers, body });

    // handle errors
    const error = {} as TError;
    error;

    return {} as TResult;
  }
}
