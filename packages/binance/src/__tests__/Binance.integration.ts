import binanceConnect from "..";
import { readCredentialsFile } from "@crypto-connect/common";

/**
 * Binance API Keys
 *
 * @group binance
 * @group integration
 */

// Read keys from file
const [apiKey, apiSecret] = readCredentialsFile(`${__dirname}/.keys`);

const setup = () => ({
  binance: binanceConnect().withApiKeys({
    apiKey,
    apiSecret,
  }),
});

describe("Binance API Keys Integration Tests (Live)", () => {
  it("should get balances", async () => {
    const { binance } = setup();

    await binance.throwErrorOnInvalidPermissions();

    const result = await binance.getBalances();

    console.log(`${result.length} accounts found`);

    expect(result).toBeDefined();
  });
});
