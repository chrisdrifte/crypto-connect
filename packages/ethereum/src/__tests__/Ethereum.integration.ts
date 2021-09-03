import ethereumConnect from "..";
import { readCredentialsFile } from "@crypto-connect/common";

/**
 * Coinbase Pro
 *
 * @group coinbase-pro
 * @group integration
 */

// Read keys from file
const [provider] = readCredentialsFile(`${__dirname}/.keys`);

const tokens = [];

const setup = () => ({
  ethereum: ethereumConnect.withProvider(
    "0x52bc44d5378309EE2abF1539BF71dE1b7d7bE3b5",
    provider,
    tokens,
  ),
});

describe("Ethereum Integration Tests (Live)", () => {
  it("should get balances", async () => {
    const { ethereum } = setup();
    const result = await ethereum.getBalances();

    console.log(result);

    expect(result).toBeDefined();
  });
});
