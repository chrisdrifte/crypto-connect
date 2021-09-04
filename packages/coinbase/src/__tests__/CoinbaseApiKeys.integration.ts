import coinbaseConnect from "..";
import { readCredentialsFile } from "@crypto-connect/common";

/**
 * Coinbase
 *
 * @group coinbase
 * @group integration
 */

// Read keys from file
const [apiKey, apiSecret] = readCredentialsFile(`${__dirname}/.keys`);

const setup = () => ({
  coinbase: coinbaseConnect().withApiKeys({
    apiKey,
    apiSecret,
  }),
});

describe("Coinbase API Keys Integration Tests (Live)", () => {
  it("should get balances", async () => {
    const { coinbase } = setup();
    const result = await coinbase.getBalances();

    console.log(`${result.length} accounts found`);

    expect(result).toBeDefined();
  });
});
