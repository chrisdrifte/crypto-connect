import krakenConnect from "..";
import { readCredentialsFile } from "@crypto-connect/common";

/**
 * Coinbase Pro
 *
 * @group coinbase-pro
 * @group integration
 */

// Read keys from file
const [apiKey, apiSecret] = readCredentialsFile(`${__dirname}/.keys`);

const setup = () => ({
  kraken: krakenConnect.withApiKeys({
    apiKey,
    apiSecret,
  }),
});

describe("Coinbase API Keys Integration Tests (Live)", () => {
  it("should get balances", async () => {
    const { kraken } = setup();
    const result = await kraken.getBalances();

    console.log(`${result.length} accounts found`);

    expect(result).toBeDefined();
  });
});
