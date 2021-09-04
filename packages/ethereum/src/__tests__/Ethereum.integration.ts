import ethereumConnect from "..";
import Web3 from "web3";
import { readCredentialsFile } from "@crypto-connect/common";

/**
 * Coinbase Pro
 *
 * @group coinbase-pro
 * @group integration
 */

// Read keys from file
const [provider] = readCredentialsFile(`${__dirname}/.keys`);

const httpProvider = new Web3.providers.HttpProvider(provider);
const tokens = [];

const setup = () => ({
  ethereum: ethereumConnect({
    web3: new Web3(httpProvider),
    tokens,
  }).withWallet("0x52bc44d5378309EE2abF1539BF71dE1b7d7bE3b5"),
});

describe("Ethereum Integration Tests (Live)", () => {
  it("should get balances", async () => {
    const { ethereum } = setup();
    const result = await ethereum.getBalances();

    console.log(result);

    expect(result).toBeDefined();
  });
});
