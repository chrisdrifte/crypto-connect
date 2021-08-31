import { CoinbaseError } from "./coinbase-types";
import { OAuth } from "@crypto-connect/common";

/**
 * Coinbase OAuth Base URL
 */
const BASE_URL = "https://api.coinbase.com";

/**
 * Coinbase OAuth Endpoints
 */
const ENDPOINTS = {
  authorizeUrl: `${BASE_URL}/oauth/authorize`,
  tokenUrl: `${BASE_URL}/oauth/token`,
};

/**
 * Make authenticated requests to Coinbase with OAuth
 */
export class CoinbaseOAuth extends OAuth<CoinbaseError> {
  endpoints = ENDPOINTS;
}
