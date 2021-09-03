import Big from "big.js";
import { BaseConnectionSecure, CryptoBalance } from "@crypto-connect/common";
import { BinanceApiKeys } from "./BinanceApiKeys";
import { BinanceCoinInfo, BinancePermissions } from "./binance-types";
import {
  ForbiddenError,
  UndocumentedResultError,
} from "@crypto-connect/errors";

// configure big to use 18 decimal places
Big.DP = 18;

/**
 * Binance API Base URL
 */
const BASE_URL = "https://api.binance.com";

/**
 * Binance Request Endpoints
 */
const ENDPOINTS = {
  permissions: `${BASE_URL}/sapi/v1/account/apiRestrictions`,
  coinInfo: `${BASE_URL}/sapi/v1/capital/config/getall`,
};

/**
 * Binance Auth Methods
 */
type BinanceAuth = BinanceApiKeys;

/**
 * Binance API Client
 */
class BinanceConnectionSecure extends BaseConnectionSecure<BinanceAuth> {
  /**
   * Supply auth in constructor
   */
  constructor(protected auth: BinanceAuth) {
    super();
  }

  /**
   * Throw `NotAuthorizedError` if user is authenticated with invalid scopes
   */
  async throwErrorOnInvalidPermissions(): Promise<void> {
    const endpoint = ENDPOINTS.permissions;
    const result = await this.auth.request<BinancePermissions>(endpoint);

    if (
      typeof result === "undefined" ||
      typeof result.enableReading === "undefined"
    ) {
      throw new UndocumentedResultError(endpoint, "BinancePermissions", result);
    }

    if (!result.enableReading) {
      console.error(`Insufficient permissions: must enable reading`);
      throw new ForbiddenError();
    }

    const extraPerms: string[] = [
      "enableWithdrawals",
      "enableInternalTransfer",
      "permitsUniversalTransfer",
      "enableVanillaOptions",
      "enableFutures",
      "enableMargin",
      "enableSpotAndMarginTrading",
    ];
    extraPerms.forEach((permKey) => {
      if (result[permKey]) {
        console.warn(`Superfluous permissions: remove ${permKey}`);
      }
    });
  }

  /**
   * Get normalized list of Binance balances
   */
  async getBalances(): Promise<CryptoBalance[]> {
    const endpoint = ENDPOINTS.coinInfo;
    const result = await this.auth.request<BinanceCoinInfo[]>(endpoint);

    if (!(result instanceof Array)) {
      throw new UndocumentedResultError(endpoint, "BinanceCoinInfo[]", result);
    }

    result.forEach((coinInfo) => {
      if (
        typeof coinInfo.coin === "undefined" ||
        typeof coinInfo.free === "undefined" ||
        typeof coinInfo.locked === "undefined"
      ) {
        throw new UndocumentedResultError(
          endpoint,
          "BinanceCoinInfo",
          coinInfo,
        );
      }
    });

    // add numbers with low precision safely
    const sum = (a, b) => Big(a).add(Big(b)).toString();

    // check if amount is greater than zero safely
    const greaterThenZero = ({ amount }) => Big(amount).gt(0);

    // extract balances from result
    const balances: CryptoBalance[] = result
      .map(({ coin, free, locked }) => ({
        id: `binance-spot-${coin}`,
        asset: coin,
        amount: sum(free, locked),
      }))
      .filter(greaterThenZero);

    return balances;
  }
}

export { BinanceConnectionSecure as Binance };
