import { AuthMethod } from "../AuthMethod";
import {
  Credentials,
  RequestHandlerOptions,
  RequestUrl,
  ResponseData,
} from "../../types";

interface OAuthCredentials extends Credentials {
  clientId: string;
  clientSecret: string;
  getTokensHandler: () => Promise<OAuthTokens> | OAuthTokens;
  setTokensHandler: (tokens: OAuthTokens) => Promise<void> | void;
}

interface OAuthEndpoints {
  authorizeUrl: string;
  tokenUrl: string;
  revokeUrl?: string;
}

interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface OAuthInterface extends AuthMethod<OAuthCredentials> {
  endpoints: OAuthEndpoints;
  signIn(redirectUri: string, scope?: string[], state?: string): string;
  exchangeCode(
    redirectUri: string,
    code: string,
    state?: string,
  ): Promise<void>;
  exchangeRefreshToken(): Promise<void>;
}

export abstract class OAuth
  extends AuthMethod<OAuthCredentials>
  implements OAuthInterface
{
  abstract endpoints: OAuthEndpoints;

  // OAuth is a standardized auth method
  // so we should be able to keep most of the logic here and
  // use it to handle OAuth for all integrations that implement it
  signIn(redirectUri: string, scope?: string[], state?: string): string {
    // check that we have config
    if (typeof this.credentials === "undefined") {
      throw new Error("You must provide credentials first");
    }

    const { authorizeUrl } = this.endpoints;
    const { clientId } = this.credentials;

    let url = authorizeUrl;
    url += "?";
    url += `&client_id=${clientId}`;
    url += "&response_type=code";
    url += `&redirect_uri=${encodeURI(redirectUri)}`;

    if (scope && scope instanceof Array) {
      url += `&scope=${scope.join(",")}`;
    }

    if (state) {
      url += `&state=${state}`;
    }

    return url;
  }

  async exchangeCode(redirectUri: string, code: string): Promise<void> {
    // check that we have config
    if (typeof this.credentials === "undefined") {
      throw new Error("You must provide credentials first");
    }

    const { tokenUrl } = this.endpoints;
    const { clientId, clientSecret } = this.credentials;
    /**
     * access_token   New active access token
     * token_type     Value bearer
     * expires_in     Access token expiration in seconds
     * refresh_token  Refresh token which can be used to refresh expired access token
     * scope          List of permissions applied to given access token
     */
    const response = await this.context.requestHandler(tokenUrl, {
      method: "POST",
      body: {
        grant_type: "authorization_code",
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: encodeURI(redirectUri),
      },
    });
    console.log(response);

    // save the tokens
    await this.credentials.setTokensHandler({
      accessToken: "xxx",
      refreshToken: "yyy",
    });
  }

  async exchangeRefreshToken(): Promise<void> {
    // check that we have config
    if (typeof this.credentials === "undefined") {
      throw new Error("You must provide credentials first");
    }

    const { tokenUrl } = this.endpoints;
    const { clientId, clientSecret } = this.credentials;
    const { refreshToken } = await this.credentials.getTokensHandler();

    /**
     * access_token   New active access token
     * token_type     Value bearer
     * expires_in     Access token expiration in seconds
     * refresh_token  New refresh token which can be used to refresh expired access token
     * scope          List of permissions applied to given access token
     */
    const response = await this.context.requestHandler(tokenUrl, {
      method: "POST",
      body: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      },
    });
    console.log(response);

    // save the tokens
    await this.credentials.setTokensHandler({
      accessToken: "xxx",
      refreshToken: "yyy",
    });
  }

  async revoke(): Promise<void> {
    // check that we have config
    if (typeof this.credentials === "undefined") {
      throw new Error("You must provide credentials first");
    }

    const { revokeUrl } = this.endpoints;

    if (!revokeUrl) {
      return;
    }

    const { accessToken } = await this.credentials.getTokensHandler();

    await this.context.requestHandler(revokeUrl, {
      method: "POST",
      body: {
        token: accessToken,
      },
    });
  }

  async request<TResult extends ResponseData>(
    url: RequestUrl,
    { method = "GET", headers = {}, body = "" }: RequestHandlerOptions = {},
  ): Promise<TResult> {
    if (typeof this.credentials === "undefined") {
      throw new Error("You must provide credentials first");
    }

    const { accessToken } = await this.credentials.getTokensHandler();

    // check that we have config
    if (typeof accessToken === "undefined") {
      throw new Error("You must authenticate first");
    }

    // code to make request, eg:
    //
    // return await axios({ method, url })

    // if the token has expired, refresh and try again
    await this.exchangeRefreshToken();
    await this.request(url, { method, headers, body });

    return {} as TResult;
  }
}
