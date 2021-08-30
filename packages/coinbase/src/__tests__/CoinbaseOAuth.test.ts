import { Coinbase } from "../Coinbase";
import {
  nodeHttpsRequestHandler,
  readCredentialsFile,
} from "@crypto-connect/common";

// Read keys from file
const [clientId, clientSecret, devToken] = readCredentialsFile(
  `${__dirname}/.keys`,
);

const setup = () => ({
  coinbase: new Coinbase({
    requestHandler: nodeHttpsRequestHandler,
  }).useOAuth({
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
