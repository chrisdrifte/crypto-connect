import { AuthMethodCredentials } from "@crypto-connect/common";
import { CoinbasePro } from "./CoinbasePro";
import { CoinbaseProApiKeys } from "./CoinbaseProApiKeys";

const coinbaseProConnect = {
  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(
    credentials: AuthMethodCredentials<CoinbaseProApiKeys>,
  ): CoinbasePro {
    const auth = new CoinbaseProApiKeys().setCredentials(credentials);
    return new CoinbasePro(auth);
  },
};

export default coinbaseProConnect;
