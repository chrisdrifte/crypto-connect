import { AuthMethodCredentials, CryptoConnect } from "@crypto-connect/common";
import { Kraken } from "./Kraken";
import { KrakenApiKeys } from "./KrakenApiKeys";

const krakenConnect: CryptoConnect<void, Kraken> = () => ({
  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(credentials: AuthMethodCredentials<KrakenApiKeys>): Kraken {
    const auth = new KrakenApiKeys().setCredentials(credentials);
    return new Kraken(auth);
  },
});

export default krakenConnect;
