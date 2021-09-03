import { AuthMethodCredentials } from "@crypto-connect/common";
import { Binance } from "./Binance";
import { BinanceApiKeys } from "./BinanceApiKeys";

const binanceConnect = {
  /**
   * Use the `ApiKeys` auth method to authorize requests
   */
  withApiKeys(credentials: AuthMethodCredentials<BinanceApiKeys>): Binance {
    const auth = new BinanceApiKeys().setCredentials(credentials);
    return new Binance(auth);
  },
};

export default binanceConnect;
