import { AuthMethodCredentials, CryptoConnect } from "@crypto-connect/common";
import { Binance } from "./Binance";
import { BinanceApiKeys } from "./BinanceApiKeys";

const binanceConnect: CryptoConnect<void, Binance> = () => ({
  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(credentials: AuthMethodCredentials<BinanceApiKeys>): Binance {
    const auth = new BinanceApiKeys().setCredentials(credentials);
    return new Binance(auth);
  },
});

export default binanceConnect;
