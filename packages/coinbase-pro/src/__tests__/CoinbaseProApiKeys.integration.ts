import { CoinbasePro } from "../CoinbasePro";
import { readCredentialsFile } from "@crypto-connect/common";

/**
 * Coinbase Pro
 *
 * @group coinbase-pro
 * @group integration
 */

// Read keys from file
const [apiKey, apiSecret, passphrase] = readCredentialsFile(
  `${__dirname}/.keys`,
);

const setup = () => ({
  coinbasePro: new CoinbasePro().withApiKeys({
    apiKey,
    apiSecret,
    passphrase,
  }),
});

describe("Coinbase API Keys Integration Tests (Live)", () => {
  it("should get balances", async () => {
    const { coinbasePro } = setup();
    const result = await coinbasePro.getBalances();

    console.log(`${result.length} accounts found`);

    expect(result).toBeDefined();
  });
});
