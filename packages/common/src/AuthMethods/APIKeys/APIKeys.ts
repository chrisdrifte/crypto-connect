import { AuthMethod } from "../AuthMethod";
import { Credentials } from "../../types";

interface APIKeysCredentials extends Credentials {
  apiKey: string;
  apiSecret: string;
}

export abstract class APIKeys extends AuthMethod<APIKeysCredentials> {}
