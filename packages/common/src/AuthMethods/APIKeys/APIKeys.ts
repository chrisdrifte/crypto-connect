import { AuthMethod, BaseCredentials } from "../AuthMethod";

/**
 * Generic API key credentials
 */
interface APIKeysCredentials extends BaseCredentials {
  apiKey: string;
  apiSecret: string;
}

/**
 * Abstract API key auth method
 */
export abstract class APIKeys extends AuthMethod<APIKeysCredentials> {}
