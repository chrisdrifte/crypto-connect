import { AuthMethodCredentials, CryptoConnect } from "@crypto-connect/common";
import { CoinbasePro } from "./CoinbasePro";
import { CoinbaseProApiKeys } from "./CoinbaseProApiKeys";

const coinbaseProConnect: CryptoConnect<void, CoinbasePro> = () => ({
  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(
    credentials: AuthMethodCredentials<CoinbaseProApiKeys>,
  ): CoinbasePro {
    const auth = new CoinbaseProApiKeys().setCredentials(credentials);
    return new CoinbasePro(auth);
  },
});

export default coinbaseProConnect;

type test = CryptoConnect<void, CoinbasePro>;

let testVar: test;