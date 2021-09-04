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
const erc20Tokens = [
  {
    name: "BAT",
    contractAddress: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
  },
];

const setup = () => ({
  ethereum: ethereumConnect({
    web3: new Web3(httpProvider),
    erc20Tokens,
  }).withWallet("0x1cf56Fd8e1567f8d663e54050d7e44643aF970Ce"),
});

describe("Ethereum Integration Tests (Live)", () => {
  it("should get balances", async () => {
    const { ethereum } = setup();
    const result = await ethereum.getBalances();

    console.log(result);

    expect(result).toBeDefined();
  });
});
