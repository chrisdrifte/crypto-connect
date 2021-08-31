import { Coinbase } from "../Coinbase";
import { readCredentialsFile } from "@crypto-connect/common";

/**
 * Coinbase
 *
 * @group coinbase
 * @group integration
 */

// Read keys from file
const [clientId, clientSecret, devToken] = readCredentialsFile(
  `${__dirname}/.keys`,
);

const setup = () => ({
  coinbase: new Coinbase().withOAuth({
    clientId,
    clientSecret,
    getTokensHandler: () => {
      return {
        accessToken: devToken || "",
        refreshToken: "",
      };
    },
    setTokensHandler: (tokens) => {
      console.log("GOT TOKENS", tokens);
    },
  }),
});

describe("Coinbase OAuth Integration Tests (Live)", () => {
  it.skip("should get balances", async () => {
    const { coinbase } = setup();
    const result = await coinbase.getBalances();

    console.log(`${result.length} accounts found`);

    expect(result).toBeDefined();
  });
});
