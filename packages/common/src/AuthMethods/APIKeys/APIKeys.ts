import { AuthMethod, BaseCredentials } from "../AuthMethod";
import { ServerError } from "../../../../errors/dist";
import {
  RequestBody,
  RequestOptions,
  RequestUrl,
  ResponseBody,
} from "../../types";

/**
 * Generic API key credentials
 */
export interface ApiKeysCredentials extends BaseCredentials {
  apiKey: string;
  apiSecret: string;
}

/**
 * Interface
 */
export interface ApiKeysInterface extends AuthMethod<ApiKeysCredentials> {
  signRequest(
    url: RequestUrl,
    requestOptions: RequestOptions,
  ): [RequestUrl, RequestOptions];
}

/**
 * Abstract API key auth method
 */
export abstract class ApiKeys<
    TCredentials extends ApiKeysCredentials = ApiKeysCredentials,
    TError = RequestBody,
  >
  extends AuthMethod<TCredentials>
  implements ApiKeysInterface
{
  /**
   * Sign a request
   */
  abstract signRequest(
    url: RequestUrl,
    requestOptions: RequestOptions,
  ): [RequestUrl, RequestOptions];

  /**
   * Make authenticated request
   */
  async request<TResult extends ResponseBody>(
    url: RequestUrl,
    { method = "GET", headers = {}, body = "" }: RequestOptions = {},
  ): Promise<TResult> {
    // Get request data from instance
    const { requestHandler } = this.context;

    // Encode apiKey and apiSecret into request here
    const signedRequestOptions = this.signRequest(url, {
      method,
      headers,
      body,
    });

    // Execute the request
    const response = await requestHandler(...signedRequestOptions);

    // Handle non-200 status
    if (response.status && response.status !== 200) {
      const error = response.body as TError;
      throw new ServerError(response.status, JSON.stringify(error));
    }

    // Return payload
    return response.body as TResult;
  }
}
