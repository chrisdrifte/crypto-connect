import { AuthMethodCredentials, CryptoConnect } from "@crypto-connect/common";
import { Coinbase } from "./Coinbase";
import { CoinbaseApiKeys } from "./CoinbaseApiKeys";
import { CoinbaseOAuth } from "./CoinbaseOAuth";

const coinbaseConnect: CryptoConnect<void, Coinbase> = () => ({
  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(credentials: AuthMethodCredentials<CoinbaseApiKeys>): Coinbase {
    const auth = new CoinbaseApiKeys().setCredentials(credentials);
    return new Coinbase(auth);
  },
  /**
   * Use the `OAuth` auth method to authorize requests
   */
  withOAuth(credentials: AuthMethodCredentials<CoinbaseOAuth>): Coinbase {
    const auth = new CoinbaseOAuth().setCredentials(credentials);
    return new Coinbase(auth);
  },
});

export default coinbaseConnect;
